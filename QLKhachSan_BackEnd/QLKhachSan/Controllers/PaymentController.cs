using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;
using QLKhachSan.Utility;
using Stripe;
using Stripe.Checkout;
using System.Net;

namespace QLKhachSan.Controllers
{
    [Route("api/Payment")]
    [ApiController]
    public class PaymentController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private string _secretKey;
        protected APIResponse _response;
        private readonly UserManager<QLKhachSan.Models.Person> _userManager;

        public PaymentController(IConfiguration configuration, IUnitOfWork unitOfWork, IMapper mapper, UserManager<QLKhachSan.Models.Person> userManager)
        {
            _secretKey = configuration.GetValue<string>("Stripe:SecretKey");
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _response = new APIResponse();
            _userManager = userManager;
        }
        [HttpGet("GetAllPayments")]
        public async Task<ActionResult<APIResponse>> GetAllPayments()
        {
            var payments = await _unitOfWork.Payment.GetAllAsync(includeProperties: "Booking");
            foreach(var payment in payments)
            {
                payment.Booking.Person = await _unitOfWork.UserManagement.GetAsync(u => u.Id == payment.Booking.PersonId);
            }
            _response.Result = payments;
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            return Ok(_response);
        }

        [HttpGet("GetPaymentByBookingId/{bookingId:int}")]
        public async Task<ActionResult<APIResponse>> GetPaymentByBookingId(int bookingId)
        {
            var payment = await _unitOfWork.Payment.GetAsync(p => p.BookingId == bookingId);
            if (payment == null)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.ErrorMessages.Add("Payment not found for the bookingId.");
                return NotFound(_response);
            }
            _response.Result = payment;
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            return Ok(_response);
        }

        [HttpPost("MakePayment/{bookingId:int}")]
        public async Task<ActionResult<APIResponse>> MakePayment(int bookingId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid User ID");
                return BadRequest(_response);
            }
            Booking booking = await _unitOfWork.Booking.GetAsync(u => u.Id == bookingId && u.PersonId == user.Id, includeProperties: "BookingService");
            if (booking == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                return BadRequest(_response);
            }
            if (booking.BookingServiceId != null)
            {
                IEnumerable<BookingServiceDetail> bookingServiceDetail = await _unitOfWork.BookingServiceDetail.GetAllAsync(u => u.BookingServiceId == booking.BookingService.Id, includeProperties: "Service");
            }
            Payment payment = new Payment()
            {
                BookingId = bookingId,
                PaymentStatus = SD.PaymentStatusPending,
                TotalPrice = booking.TotalPrice,
            };
            StripeConfiguration.ApiKey = _secretKey;
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = (long)(payment.TotalPrice * 100), // Đổi sang cents
                            Currency = "usd", // hoặc "usd"
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = $"Thanh toán đặt phòng #{booking.Id}"
                            }
                        },
                        Quantity = 1,
                    }
                },
                Mode = "payment",
                SuccessUrl = $"http://localhost:5173/payment-success?session_id={{CHECKOUT_SESSION_ID}}&bookingId={booking.Id}",
                CancelUrl = $"http://localhost:5173/payment-cancel?bookingId={booking.Id}",
                Metadata = new Dictionary<string, string>
                {
                    { "bookingId", booking.Id.ToString() },
                    { "userId", user.Id }
                }
            };

            var service = new SessionService();
            Session session = await service.CreateAsync(options);
            await _unitOfWork.Payment.CreateAsync(payment);
            _response.Result = new { SessionId = session.Id, Url = session.Url };
            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }
        [HttpPost("ConfirmPayment")]
        public async Task<IActionResult> ConfirmPayment([FromBody] string sessionId)
        {
            StripeConfiguration.ApiKey = _secretKey;

            var sessionService = new SessionService();
            var session = await sessionService.GetAsync(sessionId);

            var bookingId = int.Parse(session.Metadata["bookingId"]);
            var paymentIntentId = session.PaymentIntentId;
            var paymentMethod = session.PaymentMethodTypes.FirstOrDefault();

            var booking = await _unitOfWork.Booking.GetAsync(u => u.Id == bookingId);
            if (booking == null) return NotFound();

            booking.BookingStatus = SD.Status_Booking_Pending;
            booking.UpdateBookingDate = DateTime.Now;
            await _unitOfWork.Booking.UpdateAsync(booking);

            var payment = await _unitOfWork.Payment.GetAsync(p => p.BookingId == bookingId);
            if (payment != null)
            {
                payment.PaymentStatus = SD.PaymentStatusApproved;
                payment.StripePaymentIntentID = paymentIntentId;
                payment.PaymentDate = DateTime.Now;
                payment.PaymentMethod = paymentMethod;
            }

            await _unitOfWork.Payment.UpdateAsync(payment);

            return Ok(new { message = "Xác nhận thanh toán thành công" });
        }
        [HttpPost("RefundPayment/{bookingId:int}")]
        public async Task<IActionResult> RefundPayment(int bookingId)
        {
            _response = new APIResponse();
            StripeConfiguration.ApiKey = _secretKey;

            try
            {
                var payment = await _unitOfWork.Payment.GetAsync(p => p.BookingId == bookingId);
                if (payment == null)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.ErrorMessages.Add("Không tìm thấy thông tin thanh toán.");
                    return NotFound(_response);
                }

                if (payment.PaymentStatus != SD.PaymentStatusApproved)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.ErrorMessages.Add("Chỉ có thể hoàn tiền cho các thanh toán đã được duyệt.");
                    return BadRequest(_response);
                }

                var refundOptions = new RefundCreateOptions
                {
                    PaymentIntent = payment.StripePaymentIntentID,
                    Reason = RefundReasons.RequestedByCustomer
                };

                var refundService = new RefundService();
                Refund refund = await refundService.CreateAsync(refundOptions);
                
                // Cập nhật lại trạng thái thanh toán trong database
                payment.PaymentStatus = SD.PaymentStatusRejected;

                await _unitOfWork.Payment.UpdateAsync(payment);
                Booking booking = await _unitOfWork.Booking.GetAsync(u => u.Id == bookingId);
                if (booking != null)
                {
                    booking.BookingStatus = SD.Status_Booking_Cancelled;
                    booking.UpdateBookingDate = DateTime.Now;
                    await _unitOfWork.Booking.UpdateAsync(booking);
                }
                _response.IsSuccess = true;
                _response.StatusCode = HttpStatusCode.OK;
                _response.Result = new { message = "Hoàn tiền thành công", refundId = refund.Id };
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages.Add(ex.Message);
                return StatusCode(500, _response);
            }
        }



    }

}
