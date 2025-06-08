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
    [Route("api/BookingRoom")]
    [ApiController]
    public class BookingRoomController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        protected APIResponse _response;
        private readonly UserManager<Person> _userManager;
        public BookingRoomController(IUnitOfWork unitOfWork, IMapper mapper, UserManager<Person> userManager)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _response = new APIResponse();
            _userManager = userManager;
        }
        [HttpGet]
        public async Task<ActionResult<APIResponse>> GetBookRooms()
        {
            IEnumerable<BookingRoom> bookingRooms = await _unitOfWork.BookingRoom.GetAllAsync(includeProperties: "BookingRoomDetails");
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<IEnumerable<BookingRoomDTO>>(bookingRooms);
            return Ok(_response);
        }
        [HttpGet("{id:int}", Name = "GetBookingRoom")]
        public async Task<ActionResult<APIResponse>> GetBookRoom(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid BookingRoom ID");
                return BadRequest(_response);
            }
            BookingRoom bookingRoom = await _unitOfWork.BookingRoom.GetAsync(u => u.Id == id, includeProperties: "BookingRoomDetails");
            if (bookingRoom == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return NotFound(_response);
            }
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<BookingRoomDTO>(bookingRoom);
            return Ok(_response);
        }

        [HttpPost]

        public async Task<ActionResult<APIResponse>> CreateBookingRoom(BookingRoomDetailUpSertDTO bookingRoomDetailUpSertDTO)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid User ID");
                return BadRequest(_response);
            }
            Room Room = await _unitOfWork.Room.GetAsync(u => u.Id == bookingRoomDetailUpSertDTO.RoomId);
            if (Room == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Room item is not valid");
                return BadRequest(_response);
            }
            Booking booking = await _unitOfWork.Booking.GetAsync(u => u.PersonId == user.Id && u.BookingStatus == SD.Status_Booking_Draft, includeProperties: "BookingService");
            if (booking == null)
            {
                // chua co booking

                BookingRoom newBookingRoom = new BookingRoom()
                {
                    RoomCount = 0,
                    ToTalPrice = 0,
                    BookingRoomDetails = new List<BookingRoomDetail>()
                };
                await _unitOfWork.BookingRoom.CreateAsync(newBookingRoom);
                Booking newBooking = new Booking()
                {
                    PersonId = user.Id,
                    BookingDate = DateTime.Now,
                    TotalPrice = 0,
                    UpdateBookingDate = DateTime.Now,
                    BookingRoomId = newBookingRoom.Id,
                };
                await _unitOfWork.Booking.CreateAsync(newBooking);
                BookingRoomDetail newBookingRoomDetail = new BookingRoomDetail()
                {
                    RoomId = bookingRoomDetailUpSertDTO.RoomId,
                    BookingRoomId = newBookingRoom.Id,
                    CheckInDate = bookingRoomDetailUpSertDTO.CheckInDate,
                    CheckOutDate = bookingRoomDetailUpSertDTO.CheckOutDate,
                    NumberOfGuests = bookingRoomDetailUpSertDTO.NumberOfGuests
                };
                await _unitOfWork.BookingRoomDetail.CreateAsync(newBookingRoomDetail);
                newBookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == newBookingRoom.Id, includeProperties: "Room");
                // tinh tong tien
                foreach (var detail in newBookingRoom.BookingRoomDetails)
                {
                    if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
                        continue;

                    var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;

                    if (days <= 0)
                        continue;

                    if (days < 7)
                    {
                        newBookingRoom.ToTalPrice += detail.Room.PriceDay * days;
                    }
                    else
                    {
                        int weeks = days / 7;
                        int remainingDays = days % 7;
                        newBookingRoom.ToTalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
                    }
                }
                newBooking.TotalPrice = newBookingRoom.ToTalPrice;


                newBookingRoom.RoomCount = newBookingRoom.BookingRoomDetails.Count();
                await _unitOfWork.BookingRoom.UpdateAsync(newBookingRoom);
                newBooking.TotalPrice = newBookingRoom.ToTalPrice;
                await _unitOfWork.Booking.UpdateAsync(newBooking);
                _response.Result = _mapper.Map<BookingRoomDTO>(newBookingRoom);
                _response.StatusCode = HttpStatusCode.OK;
                return Ok(_response);
            }
            else
            {
                // da co booking
                BookingRoom bookingRoom = await _unitOfWork.BookingRoom.GetAsync(u => u.Id == booking.BookingRoomId);
                if (bookingRoom == null)
                {
                    //chua co BookingRoom
                    BookingRoom newBookingRoom = new BookingRoom()
                    {
                        RoomCount = 0,
                        ToTalPrice = 0,
                        BookingRoomDetails = new List<BookingRoomDetail>()
                    };
                    await _unitOfWork.BookingRoom.CreateAsync(newBookingRoom);
                    BookingRoomDetail bookingRoomDetail = await _unitOfWork.BookingRoomDetail.GetAsync(u => u.RoomId == bookingRoomDetailUpSertDTO.RoomId && u.BookingRoomId == newBookingRoom.Id);
                    if (bookingRoomDetail == null)
                    {
                        //chua co booking Room detail
                        BookingRoomDetail newBookingRoomDetail = new BookingRoomDetail()
                        {
                            RoomId = bookingRoomDetailUpSertDTO.RoomId,
                            BookingRoomId = newBookingRoom.Id,
                            CheckInDate = bookingRoomDetailUpSertDTO.CheckInDate,
                            CheckOutDate = bookingRoomDetailUpSertDTO.CheckOutDate,
                            NumberOfGuests = bookingRoomDetailUpSertDTO.NumberOfGuests
                        };
                        await _unitOfWork.BookingRoomDetail.CreateAsync(newBookingRoomDetail);
                        newBookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == newBookingRoom.Id, includeProperties: "Room");
                        // tinh tong tien
                        newBookingRoom.ToTalPrice = 0;
                        foreach (var detail in newBookingRoom.BookingRoomDetails)
                        {
                            if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
                                continue;

                            var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;

                            if (days <= 0)
                                continue;

                            if (days < 7)
                            {
                                newBookingRoom.ToTalPrice += detail.Room.PriceDay * days;
                            }
                            else
                            {
                                int weeks = days / 7;
                                int remainingDays = days % 7;
                                newBookingRoom.ToTalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
                            }
                        }
                        newBookingRoom.RoomCount = newBookingRoom.BookingRoomDetails.Count();
                        if (booking.BookingServiceId == null)
                        {
                            booking.TotalPrice = newBookingRoom.ToTalPrice;
                        }
                        else
                        {
                            booking.TotalPrice = booking.BookingService.ToTalPrice + newBookingRoom.ToTalPrice;
                        }
                    }
                    else
                    {
                        // da co booking Room detail
                        bookingRoomDetail.CheckOutDate = bookingRoomDetailUpSertDTO.CheckOutDate;
                        bookingRoomDetail.CheckInDate = bookingRoomDetailUpSertDTO.CheckInDate;
                        bookingRoomDetail.NumberOfGuests = bookingRoomDetailUpSertDTO.NumberOfGuests;
                        await _unitOfWork.BookingRoomDetail.UpdateAsync(bookingRoomDetail);

                        newBookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == newBookingRoom.Id, includeProperties: "Room");
                        foreach (var detail in newBookingRoom.BookingRoomDetails)
                        {
                            if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
                                continue;

                            var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;

                            if (days <= 0)
                                continue;

                            if (days < 7)
                            {
                                newBookingRoom.ToTalPrice += detail.Room.PriceDay * days;
                            }
                            else
                            {
                                int weeks = days / 7;
                                int remainingDays = days % 7;
                                newBookingRoom.ToTalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
                            }
                        }
                        newBookingRoom.RoomCount = newBookingRoom.BookingRoomDetails.Count();
                        if (booking.BookingServiceId == null)
                        {
                            booking.TotalPrice = newBookingRoom.ToTalPrice;
                        }
                        else
                        {
                            booking.TotalPrice = booking.BookingService.ToTalPrice + newBookingRoom.ToTalPrice;
                        }
                    }

                    await _unitOfWork.BookingRoom.UpdateAsync(newBookingRoom);
                    booking.BookingRoomId = newBookingRoom.Id;
                    booking.UpdateBookingDate = DateTime.Now;
                    await _unitOfWork.Booking.UpdateAsync(booking);
                    _response.Result = _mapper.Map<BookingRoomDTO>(newBookingRoom);
                    _response.StatusCode = HttpStatusCode.OK;
                    return Ok(_response);
                }
                else
                {
                    //co BookingRoom
                    BookingRoomDetail bookingRoomDetail = await _unitOfWork.BookingRoomDetail.GetAsync(u => u.RoomId == bookingRoomDetailUpSertDTO.RoomId && u.BookingRoomId == bookingRoom.Id);
                    if (bookingRoomDetail == null)
                    {
                        //chua co booking Room detail
                        BookingRoomDetail newBookingRoomDetail = new BookingRoomDetail()
                        {
                            BookingRoomId = bookingRoom.Id,
                            RoomId = bookingRoomDetailUpSertDTO.RoomId,
                            CheckInDate = bookingRoomDetailUpSertDTO.CheckInDate,
                            CheckOutDate = bookingRoomDetailUpSertDTO.CheckOutDate,
                            NumberOfGuests = bookingRoomDetailUpSertDTO.NumberOfGuests
                        };
                        await _unitOfWork.BookingRoomDetail.CreateAsync(newBookingRoomDetail);
                        bookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == bookingRoom.Id, includeProperties: "Room");
                        // tinh tong tien
                        bookingRoom.ToTalPrice = 0;
                        foreach (var detail in bookingRoom.BookingRoomDetails)
                        {
                            if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
                                continue;

                            var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;

                            if (days <= 0)
                                continue;

                            if (days < 7)
                            {
                                bookingRoom.ToTalPrice += detail.Room.PriceDay * days;
                            }
                            else
                            {
                                int weeks = days / 7;
                                int remainingDays = days % 7;
                                bookingRoom.ToTalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
                            }
                        }
                        bookingRoom.RoomCount = bookingRoom.BookingRoomDetails.Count();
                    }
                    else
                    {
                        // da co booking Room detail
                        bookingRoomDetail.CheckInDate = bookingRoomDetailUpSertDTO.CheckInDate < bookingRoomDetail.CheckInDate
                            ? bookingRoomDetailUpSertDTO.CheckInDate
                            : bookingRoomDetail.CheckInDate;

                        bookingRoomDetail.CheckOutDate = bookingRoomDetailUpSertDTO.CheckOutDate > bookingRoomDetail.CheckOutDate
                            ? bookingRoomDetailUpSertDTO.CheckOutDate
                            : bookingRoomDetail.CheckOutDate;

                        bookingRoomDetail.NumberOfGuests = bookingRoomDetailUpSertDTO.NumberOfGuests;
                        await _unitOfWork.BookingRoomDetail.UpdateAsync(bookingRoomDetail);
                        bookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == bookingRoom.Id, includeProperties: "Room");
                        // tinh tong tien
                        bookingRoom.ToTalPrice = 0;
                        foreach (var detail in bookingRoom.BookingRoomDetails)
                        {
                            if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
                                continue;

                            var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;

                            if (days <= 0)
                                continue;

                            if (days < 7)
                            {
                                bookingRoom.ToTalPrice += detail.Room.PriceDay * days;
                            }
                            else
                            {
                                int weeks = days / 7;
                                int remainingDays = days % 7;
                                bookingRoom.ToTalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
                            }
                        }
                        bookingRoom.RoomCount = bookingRoom.BookingRoomDetails.Count();
                    }
                    await _unitOfWork.BookingRoom.UpdateAsync(bookingRoom);
                    if(booking.BookingServiceId == null)
                    {
                        booking.TotalPrice = bookingRoom.ToTalPrice;
                    }
                    else
                    {
                        booking.TotalPrice = booking.BookingService.ToTalPrice + bookingRoom.ToTalPrice;
                    }
                    
                    booking.UpdateBookingDate = DateTime.Now;
                    await _unitOfWork.Booking.UpdateAsync(booking);
                    _response.Result = _mapper.Map<BookingRoomDTO>(bookingRoom);
                    _response.StatusCode = HttpStatusCode.OK;
                    return Ok(_response);
                }


            }
        }
        //[HttpPut]

        //public async Task<ActionResult<APIResponse>> UpdateBookingRoom(string userId, int RoomId, int quanlity)
        //{
        //    var user = await _userManager.FindByIdAsync(userId);
        //    if (user == null)
        //    {
        //        _response.StatusCode = HttpStatusCode.BadRequest;
        //        _response.IsSuccess = false;
        //        _response.ErrorMessages.Add("Invalid User ID");
        //        return BadRequest(_response);
        //    }
        //    Room Room = await _unitOfWork.Room.GetAsync(u => u.Id == RoomId);
        //    if (Room == null)
        //    {
        //        _response.StatusCode = HttpStatusCode.BadRequest;
        //        _response.IsSuccess = false;
        //        _response.ErrorMessages.Add("Room item is not valid");
        //        return BadRequest(_response);
        //    }
        //    Booking booking = await _unitOfWork.Booking.GetAsync(u => u.PersonId == user.Id && u.BookingStatus == SD.Status_Booking_Pending);
        //    if (booking == null)
        //    {
        //        // chua co booking

        //        BookingRoom newBookingRoom = new BookingRoom()
        //        {
        //            RoomCount = 0,
        //            ToTalPrice = 0,
        //            BookingRoomDetails = new List<BookingRoomDetail>()
        //        };
        //        await _unitOfWork.BookingRoom.CreateAsync(newBookingRoom);
        //        Booking newBooking = new Booking()
        //        {
        //            PersonId = user.Id,
        //            BookingDate = DateTime.Now,
        //            TotalPrice = 0,
        //            UpdateBookingDate = DateTime.Now,
        //            BookingRoomId = newBookingRoom.Id,
        //        };
        //        await _unitOfWork.Booking.CreateAsync(newBooking);
        //        BookingRoomDetail newBookingRoomDetail = new BookingRoomDetail()
        //        {
        //            RoomId = RoomId,
        //            Quantity = quanlity,
        //            BookingRoomId = newBookingRoom.Id,
        //        };
        //        await _unitOfWork.BookingRoomDetail.CreateAsync(newBookingRoomDetail);
        //        newBookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == newBookingRoom.Id, includeProperties: "Room");
        //        // tinh tong tien
        //        newBookingRoom.ToTalPrice = newBookingRoom.BookingRoomDetails.Sum(d => d.Quantity * d.Room.Price);
        //        newBookingRoom.RoomCount = newBookingRoom.BookingRoomDetails.Count();
        //        await _unitOfWork.BookingRoom.UpdateAsync(newBookingRoom);

        //        newBooking.TotalPrice = newBookingRoom.ToTalPrice;
        //        await _unitOfWork.Booking.UpdateAsync(newBooking);
        //        _response.Result = _mapper.Map<BookingRoomDTO>(newBookingRoom);
        //        _response.StatusCode = HttpStatusCode.OK;
        //        return Ok(_response);
        //    }
        //    else
        //    {
        //        // da co booking
        //        BookingRoom bookingRoom = await _unitOfWork.BookingRoom.GetAsync(u => u.Id == booking.BookingRoomId);
        //        if (bookingRoom == null)
        //        {
        //            //chua co BookingRoom
        //            BookingRoom newBookingRoom = new BookingRoom()
        //            {
        //                RoomCount = 0,
        //                ToTalPrice = 0,
        //                BookingRoomDetails = new List<BookingRoomDetail>()
        //            };
        //            await _unitOfWork.BookingRoom.CreateAsync(newBookingRoom);

        //            BookingRoomDetail newBookingRoomDetail = new BookingRoomDetail()
        //            {
        //                RoomId = RoomId,
        //                Quantity = quanlity,
        //                BookingRoomId = newBookingRoom.Id,
        //            };
        //            await _unitOfWork.BookingRoomDetail.CreateAsync(newBookingRoomDetail);
        //            newBookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == newBookingRoom.Id, includeProperties: "Room");
        //            // tinh tong tien
        //            newBookingRoom.ToTalPrice = newBookingRoom.BookingRoomDetails.Sum(d => d.Quantity * d.Room.Price);
        //            newBookingRoom.RoomCount = newBookingRoom.BookingRoomDetails.Count();

        //            await _unitOfWork.BookingRoom.UpdateAsync(newBookingRoom);
        //            booking.BookingRoomId = newBookingRoom.Id;

        //            if (booking.BookingRoomId == null)
        //            {
        //                booking.TotalPrice = bookingRoom.ToTalPrice;
        //            }
        //            else
        //            {
        //                BookingRoom bookingRoom = await _unitOfWork.BookingRoom.GetAsync(u => u.Id == booking.BookingRoomId, includeProperties: "BookingRoomDetails");
        //                bookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == bookingRoom.Id, includeProperties: "Room");
        //                booking.TotalPrice = 0;
        //                foreach (var detail in bookingRoom.BookingRoomDetails)
        //                {
        //                    if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
        //                        continue;

        //                    var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;

        //                    if (days <= 0)
        //                        continue;

        //                    if (days < 7)
        //                    {
        //                        booking.TotalPrice += detail.Room.PriceDay * days;
        //                    }
        //                    else
        //                    {
        //                        int weeks = days / 7;
        //                        int remainingDays = days % 7;
        //                        booking.TotalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
        //                    }
        //                }
        //                booking.TotalPrice += bookingRoom.ToTalPrice;
        //            }
        //            booking.UpdateBookingDate = DateTime.Now;
        //            await _unitOfWork.Booking.UpdateAsync(booking);
        //            _response.Result = _mapper.Map<BookingRoomDTO>(newBookingRoom);
        //            _response.StatusCode = HttpStatusCode.OK;
        //            return Ok(_response);
        //        }
        //        else
        //        {
        //            //co BookingRoom
        //            BookingRoomDetail bookingRoomDetail = await _unitOfWork.BookingRoomDetail.GetAsync(u => u.RoomId == RoomId && u.BookingRoomId == bookingRoom.Id);
        //            if (bookingRoomDetail == null)
        //            {
        //                //chua co booking Room detail
        //                BookingRoomDetail newBookingRoomDetail = new BookingRoomDetail()
        //                {
        //                    RoomId = RoomId,
        //                    Quantity = quanlity,
        //                    BookingRoomId = bookingRoom.Id,
        //                };
        //                await _unitOfWork.BookingRoomDetail.CreateAsync(newBookingRoomDetail);
        //                bookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == bookingRoom.Id, includeProperties: "Room");
        //                // tinh tong tien
        //                bookingRoom.ToTalPrice = bookingRoom.BookingRoomDetails.Sum(d => d.Quantity * d.Room.Price);
        //                bookingRoom.RoomCount = bookingRoom.BookingRoomDetails.Count();
        //            }
        //            else
        //            {
        //                // da co booking Room detail
        //                bookingRoomDetail.Quantity = quanlity;
        //                await _unitOfWork.BookingRoomDetail.UpdateAsync(bookingRoomDetail);
        //                bookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == bookingRoom.Id, includeProperties: "Room");
        //                // tinh tong tien
        //                bookingRoom.ToTalPrice = bookingRoom.BookingRoomDetails.Sum(d => d.Quantity * d.Room.Price);
        //                bookingRoom.RoomCount = bookingRoom.BookingRoomDetails.Count();
        //            }
        //            await _unitOfWork.BookingRoom.UpdateAsync(bookingRoom);
        //            if (booking.BookingRoomId == null)
        //            {
        //                booking.TotalPrice = bookingRoom.ToTalPrice;
        //            }
        //            else
        //            {
        //                BookingRoom bookingRoom = await _unitOfWork.BookingRoom.GetAsync(u => u.Id == booking.BookingRoomId, includeProperties: "BookingRoomDetails");
        //                bookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(u => u.BookingRoomId == bookingRoom.Id, includeProperties: "Room");
        //                booking.TotalPrice = 0;
        //                foreach (var detail in bookingRoom.BookingRoomDetails)
        //                {
        //                    if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
        //                        continue;

        //                    var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;

        //                    if (days <= 0)
        //                        continue;

        //                    if (days < 7)
        //                    {
        //                        booking.TotalPrice += detail.Room.PriceDay * days;
        //                    }
        //                    else
        //                    {
        //                        int weeks = days / 7;
        //                        int remainingDays = days % 7;
        //                        booking.TotalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
        //                    }
        //                }
        //                booking.TotalPrice += bookingRoom.ToTalPrice;
        //            }
        //            booking.UpdateBookingDate = DateTime.Now;
        //            await _unitOfWork.Booking.UpdateAsync(booking);
        //            _response.Result = _mapper.Map<BookingRoomDTO>(bookingRoom);
        //            _response.StatusCode = HttpStatusCode.OK;
        //            return Ok(_response);
        //        }
        //    }
        //}
        [HttpDelete]
        public async Task<ActionResult<APIResponse>> DeleteBookingRoomDetail(string userId, int bookingRoomDetailId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid User ID");
                return BadRequest(_response);
            }

            Booking booking = await _unitOfWork.Booking.GetAsync(
                u => u.PersonId == userId && u.BookingStatus == SD.Status_Booking_Draft,
                includeProperties: "BookingRoom,BookingService");

            BookingRoom bookingRoom = await _unitOfWork.BookingRoom.GetAsync(u => u.Id == booking.BookingRoomId);
            if (bookingRoom == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("BookingRoom does not exist");
                return BadRequest(_response);
            }

            BookingRoomDetail item = await _unitOfWork.BookingRoomDetail.GetAsync(
                u => u.BookingRoomId == bookingRoom.Id && u.Id == bookingRoomDetailId);

            if (item == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Item does not exist");
                return BadRequest(_response);
            }

            // Xoá BookingRoomDetail
            await _unitOfWork.BookingRoomDetail.RemoveAsync(item);

            // Lấy lại danh sách còn lại
            var remainingDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(
                u => u.BookingRoomId == bookingRoom.Id,
                includeProperties: "Room");

            if (!remainingDetails.Any())
            {
                // Xoá bookingRoom nếu không còn detail nào
                await _unitOfWork.BookingRoom.RemoveAsync(bookingRoom);

                // Cập nhật booking
                booking.BookingRoomId = null;
                booking.TotalPrice = booking.BookingService?.ToTalPrice ?? 0;
                booking.UpdateBookingDate = DateTime.Now;

                // Kiểm tra nếu không còn BookingRoomId và BookingServiceId thì xoá luôn booking
                if (booking.BookingServiceId == null)
                {
                    await _unitOfWork.Booking.RemoveAsync(booking);

                    _response.StatusCode = HttpStatusCode.OK;
                    _response.Result = null;
                    return Ok(_response);
                }

                await _unitOfWork.Booking.UpdateAsync(booking);

                _response.StatusCode = HttpStatusCode.OK;
                _response.Result = null;
                return Ok(_response);
            }
            else
            {
                // Nếu vẫn còn detail thì cập nhật bookingRoom và booking như trước
                bookingRoom.BookingRoomDetails = remainingDetails.ToList();
                bookingRoom.RoomCount = bookingRoom.BookingRoomDetails.Count();
                bookingRoom.ToTalPrice = 0;

                foreach (var detail in bookingRoom.BookingRoomDetails)
                {
                    if (detail.Room == null || detail.CheckInDate == null || detail.CheckOutDate == null)
                        continue;

                    var days = (detail.CheckOutDate - detail.CheckInDate)?.Days ?? 0;
                    if (days <= 0)
                        continue;

                    if (days < 7)
                    {
                        bookingRoom.ToTalPrice += detail.Room.PriceDay * days;
                    }
                    else
                    {
                        int weeks = days / 7;
                        int remainingDays = days % 7;
                        bookingRoom.ToTalPrice += (weeks * detail.Room.PriceWeek) + (remainingDays * detail.Room.PriceDay);
                    }
                }

                await _unitOfWork.BookingRoom.UpdateAsync(bookingRoom);

                booking.TotalPrice = (booking.BookingService?.ToTalPrice ?? 0) + bookingRoom.ToTalPrice;
                booking.UpdateBookingDate = DateTime.Now;

                await _unitOfWork.Booking.UpdateAsync(booking);

                _response.StatusCode = HttpStatusCode.OK;
                _response.Result = _mapper.Map<BookingRoomDTO>(bookingRoom);
                return Ok(_response);
            }
        }


    }
}
