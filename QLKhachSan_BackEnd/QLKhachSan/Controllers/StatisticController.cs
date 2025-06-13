using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;
using QLKhachSan.Utility;

namespace QLKhachSan.Controllers
{
    [Route("api/Statistic")]
    [ApiController]
    public class StatisticController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        protected APIResponse _response;
        private readonly UserManager<Person> _userManager;
        public StatisticController(IUnitOfWork unitOfWork, IMapper mapper, UserManager<Person> userManager)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _response = new APIResponse();
            _userManager = userManager;
        }
        [HttpGet("TotalRooms")]
        public async Task<IActionResult> GetTotalRooms()
        {
            try
            {
                var rooms = await _unitOfWork.Room.GetAllAsync(u => u.Status != SD.Status_BeingCleaned && u.Status != SD.Status_Room_Occupied);

                _response.IsSuccess = true;
                _response.Result = rooms.Count();
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }
        [HttpGet("TotalCustomers")]
        public async Task<IActionResult> GetTotalCustomers()
        {
            try
            {
                var customers = await _userManager.GetUsersInRoleAsync(SD.Role_Customer);
                int customerCount = customers.Count;

                _response.IsSuccess = true;
                _response.Result = customerCount;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }
        [HttpGet("TodayBookings")]
        public async Task<IActionResult> GetTodayBookings()
        {
            try
            {
                var today = DateTime.Today;
                var bookings = await _unitOfWork.Booking.GetAllAsync(
                    b => b.BookingDate.HasValue && b.BookingDate.Value.Date == today
                );
                int bookingCount = bookings.Count();

                _response.IsSuccess = true;
                _response.Result = bookingCount;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }
        [HttpGet("RoomsOccupiedToday")]
        public async Task<IActionResult> GetRoomsOccupiedToday()
        {
            try
            {
                var today = DateTime.Today;

                // Lấy toàn bộ bookings có BookingRoom và Person
                var bookings = await _unitOfWork.Booking.GetAllAsync(u => u.BookingStatus != SD.Status_Booking_Cancelled ,includeProperties: "BookingRoom,Person");

                // Tải BookingRoomDetails kèm Room cho từng booking
                foreach (var booking in bookings)
                {
                    if (booking.BookingRoom != null)
                    {
                        booking.BookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(
                            d => d.BookingRoomId == booking.BookingRoom.Id,
                            includeProperties: "Room"
                        );
                    }
                }

                // Lấy ra các phòng có CheckIn ≤ hôm nay và CheckOut ≥ hôm nay
                var occupiedRoomIds = bookings
                    .Where(b => b.BookingRoom != null)
                    .SelectMany(b => b.BookingRoom.BookingRoomDetails)
                    .Where(d => d.CheckInDate.HasValue && d.CheckOutDate.HasValue &&
                                d.CheckInDate.Value.Date <= today && d.CheckOutDate.Value.Date >= today &&
                                d.Room != null)
                    .Select(d => d.Room.Id)
                    .Distinct()
                    .ToList();

                _response.IsSuccess = true;
                _response.Result = occupiedRoomIds.Count;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

        [HttpGet("RevenueLast7Days")]
        public async Task<IActionResult> GetRevenueLast7Days()
        {
            try
            {
                var today = DateTime.Today;
                var sevenDaysAgo = today.AddDays(-6);

                // Lấy danh sách bookings hợp lệ
                var payments = await _unitOfWork.Payment.GetAllAsync(
                    b => b.PaymentDate >= sevenDaysAgo &&
                         b.PaymentDate <= today.AddDays(1) &&
                         b.PaymentStatus != SD.PaymentStatusRejected
                );

                // Tính tổng doanh thu theo ngày có dữ liệu
                var revenueDict = payments
                    .GroupBy(b => b.PaymentDate!.Value.Date)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Sum(b => b.TotalPrice)
                    );

                // Tạo danh sách đủ 7 ngày gần nhất
                var last7DaysRevenue = Enumerable.Range(0, 7)
                    .Select(i =>
                    {
                        var date = sevenDaysAgo.AddDays(i);
                        return new
                        {
                            Date = date.ToString("yyyy-MM-dd"),
                            TotalRevenue = revenueDict.ContainsKey(date) ? revenueDict[date] : 0
                        };
                    })
                    .ToList();

                _response.IsSuccess = true;
                _response.Result = last7DaysRevenue;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }
        [HttpGet("BookingCountByRoomType")]
        public async Task<IActionResult> GetBookingCountByRoomType()
        {
            try
            {
                var bookings = await _unitOfWork.Booking.GetAllAsync(b => b.BookingStatus != SD.Status_Booking_Cancelled && b.BookingRoomId != null, includeProperties: "BookingRoom");

                foreach (var booking in bookings)
                {
                    if (booking.BookingRoom != null)
                    {
                        booking.BookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(d => d.BookingRoomId == booking.BookingRoom.Id, includeProperties: "Room");

                        foreach (var detail in booking.BookingRoom.BookingRoomDetails)
                        {
                            if (detail.Room != null)
                            {
                                detail.Room.CategoryRoom = await _unitOfWork.CategoryRoom.GetAsync(c => c.Id == detail.Room.CategoryRoomId);
                            }
                        }
                    }
                }

                // Đếm số lượng đặt theo loại phòng
                var bookingCounts = bookings
                    .SelectMany(b => b.BookingRoom.BookingRoomDetails)
                    .GroupBy(br => br.Room.CategoryRoom.Name)
                    .Select(g => new
                    {
                        RoomType = g.Key,
                        Count = g.Count()
                    })
                    .ToList();

                _response.IsSuccess = true;
                _response.Result = bookingCounts;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }
    }
}
