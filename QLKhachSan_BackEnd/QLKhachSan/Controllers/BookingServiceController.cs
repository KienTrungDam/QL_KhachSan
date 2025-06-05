using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using QLKhachSan.Models;
using QLKhachSan.Models.DTO;
using QLKhachSan.Repository.IRepository;
using QLKhachSan.Utility;
using System.Net;

namespace QLKhachSan.Controllers
{
    [Route("api/BookingService")]
    [ApiController]
    public class BookingServiceController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        protected APIResponse _response;
        private readonly UserManager<Person> _userManager;
        public BookingServiceController(IUnitOfWork unitOfWork, IMapper mapper, UserManager<Person> userManager)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _response = new APIResponse();
            _userManager = userManager;
        }
        [HttpGet]
        public async Task<ActionResult<APIResponse>> GetBookServices()
        {
            IEnumerable<BookingService> bookingServices = await _unitOfWork.BookingService.GetAllAsync(includeProperties: "BookingServiceDetails");
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<IEnumerable<BookingServiceDTO>>(bookingServices);
            return Ok(_response);
        }
        [HttpGet("{id:int}", Name = "GetBookingService")]
        public async Task<ActionResult<APIResponse>> GetBookService(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid BookingService ID");
                return BadRequest(_response);
            }
            BookingService bookingService = await _unitOfWork.BookingService.GetAsync(u => u.Id == id, includeProperties: "BookingServiceDetails");
            if (bookingService == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return NotFound(_response);
            }
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<BookingServiceDTO>(bookingService);
            return Ok(_response);
        }

        [HttpPost]

        public async Task<ActionResult<APIResponse>> CreateBookingService(int serviceId, int quanlity)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid User ID");
                return BadRequest(_response);
            }
            Service service = await _unitOfWork.Service.GetAsync(u => u.Id == serviceId);
            if (service == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Service item is not valid");
                return BadRequest(_response);
            }
            Booking booking = await _unitOfWork.Booking.GetAsync(u => u.PersonId == user.Id && u.BookingStatus == SD.Status_Booking_Draft);
            if (booking == null)
            {
                // chua co booking

                BookingService newBookingService = new BookingService()
                {
                    ServiceCount = 0,
                    ToTalPrice = 0,
                    BookingServiceDetails = new List<BookingServiceDetail>()
                };
                await _unitOfWork.BookingService.CreateAsync(newBookingService);
                Booking newBooking = new Booking()
                {
                    PersonId = user.Id,
                    BookingDate = DateTime.Now,
                    TotalPrice = 0,
                    UpdateBookingDate = DateTime.Now,
                    BookingServiceId = newBookingService.Id,
                };
                await _unitOfWork.Booking.CreateAsync(newBooking);
                BookingServiceDetail newBookingServiceDetail = new BookingServiceDetail()
                {
                    ServiceId = serviceId,
                    Quantity = quanlity,
                    BookingServiceId = newBookingService.Id,
                };
                await _unitOfWork.BookingServiceDetail.CreateAsync(newBookingServiceDetail);
                newBookingService.BookingServiceDetails = await _unitOfWork.BookingServiceDetail.GetAllAsync(u => u.BookingServiceId == newBookingService.Id, includeProperties: "Service");
                // tinh tong tien
                newBookingService.ToTalPrice = newBookingService.BookingServiceDetails.Sum(d => d.Quantity * d.Service.Price);
                newBookingService.ServiceCount = newBookingService.BookingServiceDetails.Count();
                await _unitOfWork.BookingService.UpdateAsync(newBookingService);
                newBooking.TotalPrice = newBookingService.ToTalPrice;
                await _unitOfWork.Booking.UpdateAsync(newBooking);
                _response.Result = _mapper.Map<BookingServiceDTO>(newBookingService);
                _response.StatusCode = HttpStatusCode.OK;
                return Ok(_response);
            }
            else
            {
                // da co booking
                BookingService bookingService = await _unitOfWork.BookingService.GetAsync(u => u.Id == booking.BookingServiceId);
                if (bookingService == null)
                {
                    //chua co BookingService
                    BookingService newBookingService = new BookingService()
                    {
                        ServiceCount = 0,
                        ToTalPrice = 0,
                        BookingServiceDetails = new List<BookingServiceDetail>()
                    };
                    await _unitOfWork.BookingService.CreateAsync(newBookingService);
                    BookingServiceDetail bookingServiceDetail = await _unitOfWork.BookingServiceDetail.GetAsync(u => u.ServiceId == serviceId && u.BookingServiceId == newBookingService.Id);
                    if (bookingServiceDetail == null)
                    {
                        //chua co booking service detail
                        BookingServiceDetail newBookingServiceDetail = new BookingServiceDetail()
                        {
                            ServiceId = serviceId,
                            Quantity = quanlity,
                            BookingServiceId = newBookingService.Id,
                        };
                        await _unitOfWork.BookingServiceDetail.CreateAsync(newBookingServiceDetail);
                        newBookingService.BookingServiceDetails = await _unitOfWork.BookingServiceDetail.GetAllAsync(u => u.BookingServiceId == newBookingService.Id, includeProperties: "Service");
                        // tinh tong tien
                        newBookingService.ToTalPrice = newBookingService.BookingServiceDetails.Sum(d => d.Quantity * d.Service.Price);
                        newBookingService.ServiceCount = newBookingService.BookingServiceDetails.Count();
                    }
                    else
                    {
                        // da co booking service detail
                        bookingServiceDetail.Quantity += quanlity;
                        await _unitOfWork.BookingServiceDetail.UpdateAsync(bookingServiceDetail);
                        newBookingService.BookingServiceDetails = await _unitOfWork.BookingServiceDetail.GetAllAsync(u => u.BookingServiceId == newBookingService.Id, includeProperties: "Service");
                        // tinh tong tien
                        newBookingService.ToTalPrice = newBookingService.BookingServiceDetails.Sum(d => d.Quantity * d.Service.Price);
                        newBookingService.ServiceCount = newBookingService.BookingServiceDetails.Count();
                    }

                    await _unitOfWork.BookingService.UpdateAsync(newBookingService);
                    booking.BookingServiceId = newBookingService.Id;
                    booking.TotalPrice += newBookingService.ToTalPrice;
                    booking.UpdateBookingDate = DateTime.Now;
                    await _unitOfWork.Booking.UpdateAsync(booking);
                    _response.Result = _mapper.Map<BookingServiceDTO>(newBookingService);
                    _response.StatusCode = HttpStatusCode.OK;
                    return Ok(_response);
                }
                else
                {
                    //co BookingService
                    BookingServiceDetail bookingServiceDetail = await _unitOfWork.BookingServiceDetail.GetAsync(u => u.ServiceId == serviceId && u.BookingServiceId == bookingService.Id);
                    if (bookingServiceDetail == null)
                    {
                        //chua co booking service detail
                        BookingServiceDetail newBookingServiceDetail = new BookingServiceDetail()
                        {
                            ServiceId = serviceId,
                            Quantity = quanlity,
                            BookingServiceId = bookingService.Id,
                        };
                        await _unitOfWork.BookingServiceDetail.CreateAsync(newBookingServiceDetail);
                        bookingService.BookingServiceDetails = await _unitOfWork.BookingServiceDetail.GetAllAsync(u => u.BookingServiceId == bookingService.Id, includeProperties: "Service");
                        // tinh tong tien
                        bookingService.ToTalPrice = bookingService.BookingServiceDetails.Sum(d => d.Quantity * d.Service.Price);
                        bookingService.ServiceCount = bookingService.BookingServiceDetails.Count();
                    }
                    else
                    {
                        // da co booking service detail
                        bookingServiceDetail.Quantity += quanlity;
                        await _unitOfWork.BookingServiceDetail.UpdateAsync(bookingServiceDetail);
                        bookingService.BookingServiceDetails = await _unitOfWork.BookingServiceDetail.GetAllAsync(u => u.BookingServiceId == bookingService.Id, includeProperties: "Service");
                        // tinh tong tien
                        bookingService.ToTalPrice = bookingService.BookingServiceDetails.Sum(d => d.Quantity * d.Service.Price);
                        bookingService.ServiceCount = bookingService.BookingServiceDetails.Count();
                    }
                    await _unitOfWork.BookingService.UpdateAsync(bookingService);
                    // tinh tong tien booking
                    if(booking.BookingRoomId == null)
                    {
                        booking.TotalPrice = bookingService.ToTalPrice;
                    }
                    else
                    {
                        BookingRoom bookingRoom = await _unitOfWork.BookingRoom.GetAsync(u => u.Id == booking.BookingRoomId, includeProperties: "BookingRoomDetails");
                        bookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == bookingRoom.Id, includeProperties: "Room");
                        booking.TotalPrice = 0;
                        foreach (var detail in bookingRoom.BookingRoomDetails)
                        {
                            if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
                                continue;

                            var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;

                            if (days <= 0)
                                continue;

                            if (days < 7)
                            {
                                booking.TotalPrice += detail.Room.PriceDay * days;
                            }
                            else
                            {
                                int weeks = days / 7;
                                int remainingDays = days % 7;
                                booking.TotalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
                            }
                        }
                        booking.TotalPrice += bookingService.ToTalPrice;
                    }
                   
                    booking.UpdateBookingDate = DateTime.Now;
                    await _unitOfWork.Booking.UpdateAsync(booking);
                    _response.Result = _mapper.Map<BookingServiceDTO>(bookingService);
                    _response.StatusCode = HttpStatusCode.OK;
                    return Ok(_response);
                }


            }
        }
        [HttpPut]

        public async Task<ActionResult<APIResponse>> UpdateBookingService(string userId, int serviceId, int quanlity)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid User ID");
                return BadRequest(_response);
            }
            Service service = await _unitOfWork.Service.GetAsync(u => u.Id == serviceId);
            if (service == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Service item is not valid");
                return BadRequest(_response);
            }
            Booking booking = await _unitOfWork.Booking.GetAsync(u => u.PersonId == user.Id && u.BookingStatus == SD.Status_Booking_Draft);
            if (booking == null)
            {
                // chua co booking

                BookingService newBookingService = new BookingService()
                {
                    ServiceCount = 0,
                    ToTalPrice = 0,
                    BookingServiceDetails = new List<BookingServiceDetail>()
                };
                await _unitOfWork.BookingService.CreateAsync(newBookingService);
                Booking newBooking = new Booking()
                {
                    PersonId = user.Id,
                    BookingDate = DateTime.Now,
                    TotalPrice = 0,
                    UpdateBookingDate = DateTime.Now,
                    BookingServiceId = newBookingService.Id,
                };
                await _unitOfWork.Booking.CreateAsync(newBooking);
                BookingServiceDetail newBookingServiceDetail = new BookingServiceDetail()
                {
                    ServiceId = serviceId,
                    Quantity = quanlity,
                    BookingServiceId = newBookingService.Id,
                };
                await _unitOfWork.BookingServiceDetail.CreateAsync(newBookingServiceDetail);
                newBookingService.BookingServiceDetails = await _unitOfWork.BookingServiceDetail.GetAllAsync(u => u.BookingServiceId == newBookingService.Id, includeProperties: "Service");
                // tinh tong tien
                newBookingService.ToTalPrice = newBookingService.BookingServiceDetails.Sum(d => d.Quantity * d.Service.Price);
                newBookingService.ServiceCount = newBookingService.BookingServiceDetails.Count();
                await _unitOfWork.BookingService.UpdateAsync(newBookingService);

                newBooking.TotalPrice = newBookingService.ToTalPrice;
                await _unitOfWork.Booking.UpdateAsync(newBooking);
                _response.Result = _mapper.Map<BookingServiceDTO>(newBookingService);
                _response.StatusCode = HttpStatusCode.OK;
                return Ok(_response);
            }
            else
            {
                // da co booking
                BookingService bookingService = await _unitOfWork.BookingService.GetAsync(u => u.Id == booking.BookingServiceId);
                if (bookingService == null)
                {
                    //chua co BookingService
                    BookingService newBookingService = new BookingService()
                    {
                        ServiceCount = 0,
                        ToTalPrice = 0,
                        BookingServiceDetails = new List<BookingServiceDetail>()
                    };
                    await _unitOfWork.BookingService.CreateAsync(newBookingService);

                    BookingServiceDetail newBookingServiceDetail = new BookingServiceDetail()
                    {
                        ServiceId = serviceId,
                        Quantity = quanlity,
                        BookingServiceId = newBookingService.Id,
                    };
                    await _unitOfWork.BookingServiceDetail.CreateAsync(newBookingServiceDetail);
                    newBookingService.BookingServiceDetails = await _unitOfWork.BookingServiceDetail.GetAllAsync(u => u.BookingServiceId == newBookingService.Id, includeProperties: "Service");
                    // tinh tong tien
                    newBookingService.ToTalPrice = newBookingService.BookingServiceDetails.Sum(d => d.Quantity * d.Service.Price);
                    newBookingService.ServiceCount = newBookingService.BookingServiceDetails.Count();

                    await _unitOfWork.BookingService.UpdateAsync(newBookingService);
                    booking.BookingServiceId = newBookingService.Id;

                    if (booking.BookingRoomId == null)
                    {
                        booking.TotalPrice = bookingService.ToTalPrice;
                    }
                    else
                    {
                        BookingRoom bookingRoom = await _unitOfWork.BookingRoom.GetAsync(u => u.Id == booking.BookingRoomId, includeProperties: "BookingRoomDetails");
                        bookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == bookingRoom.Id, includeProperties: "Room");
                        booking.TotalPrice = 0;
                        foreach (var detail in bookingRoom.BookingRoomDetails)
                        {
                            if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
                                continue;

                            var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;

                            if (days <= 0)
                                continue;

                            if (days < 7)
                            {
                                booking.TotalPrice += detail.Room.PriceDay * days;
                            }
                            else
                            {
                                int weeks = days / 7;
                                int remainingDays = days % 7;
                                booking.TotalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
                            }
                        }
                        booking.TotalPrice += bookingService.ToTalPrice;
                    }
                    booking.UpdateBookingDate = DateTime.Now;
                    await _unitOfWork.Booking.UpdateAsync(booking);
                    _response.Result = _mapper.Map<BookingServiceDTO>(newBookingService);
                    _response.StatusCode = HttpStatusCode.OK;
                    return Ok(_response);
                }
                else
                {
                    //co BookingService
                    BookingServiceDetail bookingServiceDetail = await _unitOfWork.BookingServiceDetail.GetAsync(u => u.ServiceId == serviceId && u.BookingServiceId == bookingService.Id);
                    if (bookingServiceDetail == null)
                    {
                        //chua co booking service detail
                        BookingServiceDetail newBookingServiceDetail = new BookingServiceDetail()
                        {
                            ServiceId = serviceId,
                            Quantity = quanlity,
                            BookingServiceId = bookingService.Id,
                        };
                        await _unitOfWork.BookingServiceDetail.CreateAsync(newBookingServiceDetail);
                        bookingService.BookingServiceDetails = await _unitOfWork.BookingServiceDetail.GetAllAsync(u => u.BookingServiceId == bookingService.Id, includeProperties: "Service");
                        // tinh tong tien
                        bookingService.ToTalPrice = bookingService.BookingServiceDetails.Sum(d => d.Quantity * d.Service.Price);
                        bookingService.ServiceCount = bookingService.BookingServiceDetails.Count();
                    }
                    else
                    {
                        // da co booking service detail
                        bookingServiceDetail.Quantity = quanlity;
                        await _unitOfWork.BookingServiceDetail.UpdateAsync(bookingServiceDetail);
                        bookingService.BookingServiceDetails = await _unitOfWork.BookingServiceDetail.GetAllAsync(u => u.BookingServiceId == bookingService.Id, includeProperties: "Service");
                        // tinh tong tien
                        bookingService.ToTalPrice = bookingService.BookingServiceDetails.Sum(d => d.Quantity * d.Service.Price);
                        bookingService.ServiceCount = bookingService.BookingServiceDetails.Count();
                    }
                    await _unitOfWork.BookingService.UpdateAsync(bookingService);
                    if (booking.BookingRoomId == null)
                    {
                        booking.TotalPrice = bookingService.ToTalPrice;
                    }
                    else
                    {
                        BookingRoom bookingRoom = await _unitOfWork.BookingRoom.GetAsync(u => u.Id == booking.BookingRoomId, includeProperties: "BookingRoomDetails");
                        bookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == bookingRoom.Id, includeProperties: "Room");
                        booking.TotalPrice = 0;
                        foreach (var detail in bookingRoom.BookingRoomDetails)
                        {
                            if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
                                continue;

                            var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;

                            if (days <= 0)
                                continue;

                            if (days < 7)
                            {
                                booking.TotalPrice += detail.Room.PriceDay * days;
                            }
                            else
                            {
                                int weeks = days / 7;
                                int remainingDays = days % 7;
                                booking.TotalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
                            }
                        }
                        booking.TotalPrice += bookingService.ToTalPrice;
                    }
                    booking.UpdateBookingDate = DateTime.Now;
                    await _unitOfWork.Booking.UpdateAsync(booking);
                    _response.Result = _mapper.Map<BookingServiceDTO>(bookingService);
                    _response.StatusCode = HttpStatusCode.OK;
                    return Ok(_response);
                }
            }
        }
        [HttpDelete]
        public async Task<ActionResult<APIResponse>> DeleteBookingServiceDetail(string userId, int bookingServiceDetailId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid User ID");
                return BadRequest(_response);
            }
            Booking booking = await _unitOfWork.Booking.GetAsync(u => u.PersonId == userId, includeProperties: "Room");
            BookingService bookingService = await _unitOfWork.BookingService.GetAsync(u => u.Id == booking.Id);
            if (bookingService == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("BookingService does not exist");
                return BadRequest(_response);
            }
            BookingServiceDetail item = await _unitOfWork.BookingServiceDetail.GetAsync(u => u.BookingServiceId == bookingService.Id && u.Id == bookingServiceDetailId);
            if (item == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("item does not exist");
                return BadRequest(_response);
            }
            else
            {
                await _unitOfWork.BookingServiceDetail.RemoveAsync(item);
                //update lai ShoppingCart
                bookingService.BookingServiceDetails = await _unitOfWork.BookingServiceDetail.GetAllAsync(u => u.BookingServiceId == bookingService.Id, includeProperties: "Service");
                bookingService.ServiceCount = bookingService.BookingServiceDetails.Count();
                bookingService.ToTalPrice = bookingService.BookingServiceDetails.Sum(d => d.Quantity * d.Service.Price);
                await _unitOfWork.BookingService.UpdateAsync(bookingService);
                booking.UpdateBookingDate = DateTime.Now;
                if (booking.BookingRoomId == null)
                {
                    booking.TotalPrice = bookingService.ToTalPrice;
                }
                else
                {
                    BookingRoom bookingRoom = await _unitOfWork.BookingRoom.GetAsync(u => u.Id == booking.BookingRoomId, includeProperties: "BookingRoomDetails");
                    bookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == bookingRoom.Id, includeProperties: "Room");
                    booking.TotalPrice = 0;
                    foreach (var detail in bookingRoom.BookingRoomDetails)
                    {
                        if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
                            continue;

                        var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;

                        if (days <= 0)
                            continue;

                        if (days < 7)
                        {
                            booking.TotalPrice += detail.Room.PriceDay * days;
                        }
                        else
                        {
                            int weeks = days / 7;
                            int remainingDays = days % 7;
                            booking.TotalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
                        }
                    }
                    booking.TotalPrice += bookingService.ToTalPrice;
                }
                await _unitOfWork.Booking.UpdateAsync(booking);
                _response.StatusCode = HttpStatusCode.OK;
                _response.Result = _mapper.Map<BookingServiceDTO>(bookingService);
                return Ok(_response);
            }
        }
        [HttpPut("MinusService")]
        public async Task<ActionResult<APIResponse>> MinusService(string userId, int bookingServiceDetailId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid User ID");
                return BadRequest(_response);
            }

            Booking booking = await _unitOfWork.Booking.GetAsync(u => u.PersonId == userId && u.BookingStatus == SD.Status_Booking_Draft);
            BookingService bookingService = await _unitOfWork.BookingService.GetAsync(u => u.Id == booking.BookingServiceId);
            if (bookingService == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("BookingService does not exist");
                return BadRequest(_response);
            }

            BookingServiceDetail item = await _unitOfWork.BookingServiceDetail.GetAsync(
                u => u.BookingServiceId == bookingService.Id && u.Id == bookingServiceDetailId,
                includeProperties: "Service"
            );
            if (item == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Service detail does not exist");
                return BadRequest(_response);
            }

            // Giảm số lượng hoặc xóa nếu số lượng còn 1
            if (item.Quantity <= 1)
            {
                await _unitOfWork.BookingServiceDetail.RemoveAsync(item);
            }
            else
            {
                item.Quantity -= 1;
                await _unitOfWork.BookingServiceDetail.UpdateAsync(item);
            }

            // Cập nhật lại dịch vụ
            var remainingDetails = await _unitOfWork.BookingServiceDetail.GetAllAsync(
                u => u.BookingServiceId == bookingService.Id,
                includeProperties: "Service"
            );

            if (!remainingDetails.Any())
            {
                // Nếu không còn dịch vụ nào → Xoá BookingService
                await _unitOfWork.BookingService.RemoveAsync(bookingService);

                // Cập nhật booking
                booking.BookingServiceId = null;
                booking.TotalPrice = 0;
                booking.UpdateBookingDate = DateTime.Now;

                // Nếu còn booking room thì cộng giá tiền phòng
                if (booking.BookingRoomId != null)
                {
                    BookingRoom bookingRoom = await _unitOfWork.BookingRoom.GetAsync(
                        u => u.Id == booking.BookingRoomId,
                        includeProperties: "BookingRoomDetails"
                    );
                    bookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(
                        u => u.BookingRoomId == bookingRoom.Id,
                        includeProperties: "Room"
                    );

                    foreach (var detail in bookingRoom.BookingRoomDetails)
                    {
                        if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
                            continue;

                        var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;
                        if (days <= 0)
                            continue;

                        if (days < 7)
                        {
                            booking.TotalPrice += detail.Room.PriceDay * days;
                        }
                        else
                        {
                            int weeks = days / 7;
                            int remainingDays = days % 7;
                            booking.TotalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
                        }
                    }
                    await _unitOfWork.Booking.UpdateAsync(booking);
                }
                else
                {
                    // Nếu không còn BookingRoom thì tổng tiền Booking là 0
                    await _unitOfWork.Booking.RemoveAsync(booking);
                }
                

                _response.StatusCode = HttpStatusCode.OK;
                _response.Result = null;
                return Ok(_response);
            }
            else
            {
                // Nếu vẫn còn dịch vụ → cập nhật lại BookingService
                bookingService.BookingServiceDetails = remainingDetails.ToList();
                bookingService.ServiceCount = bookingService.BookingServiceDetails.Count();
                bookingService.ToTalPrice = bookingService.BookingServiceDetails.Sum(d => d.Quantity * d.Service.Price);
                await _unitOfWork.BookingService.UpdateAsync(bookingService);

                // Cập nhật lại Booking
                booking.UpdateBookingDate = DateTime.Now;
                booking.TotalPrice = bookingService.ToTalPrice;

                if (booking.BookingRoomId != null)
                {
                    BookingRoom bookingRoom = await _unitOfWork.BookingRoom.GetAsync(
                        u => u.Id == booking.BookingRoomId,
                        includeProperties: "BookingRoomDetails"
                    );
                    bookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(
                        u => u.BookingRoomId == bookingRoom.Id,
                        includeProperties: "Room"
                    );

                    foreach (var detail in bookingRoom.BookingRoomDetails)
                    {
                        if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
                            continue;

                        var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;
                        if (days <= 0)
                            continue;

                        if (days < 7)
                        {
                            booking.TotalPrice += detail.Room.PriceDay * days;
                        }
                        else
                        {
                            int weeks = days / 7;
                            int remainingDays = days % 7;
                            booking.TotalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
                        }
                    }
                }

                await _unitOfWork.Booking.UpdateAsync(booking);

                _response.StatusCode = HttpStatusCode.OK;
                _response.Result = _mapper.Map<BookingServiceDTO>(bookingService);
                return Ok(_response);
            }
        }

        [HttpPut("PlusService")]
        public async Task<ActionResult<APIResponse>> PlusService(string userId, int bookingServiceDetailId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid User ID");
                return BadRequest(_response);
            }

            Booking booking = await _unitOfWork.Booking.GetAsync(u => u.PersonId == userId && u.BookingStatus == SD.Status_Booking_Draft);
            BookingService bookingService = await _unitOfWork.BookingService.GetAsync(u => u.Id == booking.BookingServiceId);
            if (bookingService == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("BookingService does not exist");
                return BadRequest(_response);
            }

            BookingServiceDetail item = await _unitOfWork.BookingServiceDetail.GetAsync(u => u.BookingServiceId == bookingService.Id && u.Id == bookingServiceDetailId, includeProperties: "Service");
            if (item == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Service detail does not exist");
                return BadRequest(_response);
            }

            // Tăng số lượng
            item.Quantity += 1;
            await _unitOfWork.BookingServiceDetail.UpdateAsync(item);

            // Cập nhật lại BookingService
            bookingService.BookingServiceDetails = await _unitOfWork.BookingServiceDetail.GetAllAsync(
                u => u.BookingServiceId == bookingService.Id, includeProperties: "Service"
            );
            bookingService.ServiceCount = bookingService.BookingServiceDetails.Count();
            bookingService.ToTalPrice = bookingService.BookingServiceDetails.Sum(d => d.Quantity * d.Service.Price);
            await _unitOfWork.BookingService.UpdateAsync(bookingService);

            // Cập nhật tổng tiền Booking
            booking.UpdateBookingDate = DateTime.Now;
            if (booking.BookingRoomId == null)
            {
                booking.TotalPrice = bookingService.ToTalPrice;
            }
            else
            {
                BookingRoom bookingRoom = await _unitOfWork.BookingRoom.GetAsync(u => u.Id == booking.BookingRoomId, includeProperties: "BookingRoomDetails");
                bookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == bookingRoom.Id, includeProperties: "Room");

                booking.TotalPrice = 0;
                foreach (var detail in bookingRoom.BookingRoomDetails)
                {
                    if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
                        continue;

                    var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;
                    if (days <= 0)
                        continue;

                    if (days < 7)
                    {
                        booking.TotalPrice += detail.Room.PriceDay * days;
                    }
                    else
                    {
                        int weeks = days / 7;
                        int remainingDays = days % 7;
                        booking.TotalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
                    }
                }
                booking.TotalPrice += bookingService.ToTalPrice;
            }

            await _unitOfWork.Booking.UpdateAsync(booking);

            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<BookingServiceDTO>(bookingService);
            return Ok(_response);
        }


    }
}
