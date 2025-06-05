using Azure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using QLKhachSan.Models.DTO;
using QLKhachSan.Models;
using QLKhachSan.Utility;
using System.Net;
using AutoMapper;
using QLKhachSan.Repository.IRepository;

namespace QLKhachSan.Controllers
{
    [Route("api/Booking")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        protected APIResponse _response;
        private readonly UserManager<Person> _userManager;
        public BookingController(IUnitOfWork unitOfWork, IMapper mapper, UserManager<Person> userManager)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _response = new APIResponse();
            _userManager = userManager;
        }
        [HttpGet]
        public async Task<ActionResult<APIResponse>> GetBookings()
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                var bookings = await _unitOfWork.Booking.GetAllAsync(includeProperties: "BookingRoom,BookingService,Person");
                
                
                foreach (var booking in bookings)
                {
                    if (booking.BookingService != null)
                    {
                        booking.BookingService.BookingServiceDetails = await _unitOfWork.BookingServiceDetail.GetAllAsync(d => d.BookingServiceId == booking.BookingService.Id, includeProperties: "Service");
                    }
                    if (booking.BookingRoom != null)
                    {
                        booking.BookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(d => d.BookingRoomId == booking.BookingRoom.Id, includeProperties: "Room");

                        foreach (var detail in booking.BookingRoom.BookingRoomDetails)
                        {
                            if (detail.Room != null)
                            {
                                detail.Room.RoomImages = await _unitOfWork.RoomImage.GetAllAsync(img => img.RoomId == detail.RoomId);
                                detail.Room.CategoryRoom = await _unitOfWork.CategoryRoom.GetAsync(c => c.Id == detail.Room.CategoryRoomId);
                            }
                        }
                    }
                }
                bool isAdmin = await _userManager.IsInRoleAsync(user, SD.Role_Admin);
                bool isEmployee = await _userManager.IsInRoleAsync(user, SD.Role_Employee);

                var filteredBookings = (isAdmin || isEmployee)
                    ? bookings
                    : bookings.Where(b => b.PersonId == user.Id);

                _response.Result = _mapper.Map<IEnumerable<BookingDTO>>(filteredBookings);
                _response.StatusCode = HttpStatusCode.OK;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.ErrorMessages.Add(ex.Message);
                return BadRequest(_response);
            }
        }

        [HttpGet("{id:int}", Name = "GetBooking")]
        public async Task<ActionResult<APIResponse>> GetBooking(int id)
        {
            try
            {
                if (id == 0)
                {
                    throw new Exception("Id is not valid");
                }
                Booking booking = await _unitOfWork.Booking.GetAsync(u => u.Id == id, includeProperties: "BookingService,BookingRoom,Person");
                if (booking.BookingService != null)
                {
                    booking.BookingService.BookingServiceDetails = await _unitOfWork.BookingServiceDetail.GetAllAsync(d => d.BookingServiceId == booking.BookingService.Id, includeProperties: "Service");
                }
                if (booking.BookingRoom != null)
                {
                    booking.BookingRoom.BookingRoomDetails = await _unitOfWork.BookingRoomDetail.GetAllAsync(d => d.BookingRoomId == booking.BookingRoom.Id, includeProperties: "Room");

                    foreach (var detail in booking.BookingRoom.BookingRoomDetails)
                    {
                        if (detail.Room != null)
                        {
                            detail.Room.RoomImages = await _unitOfWork.RoomImage.GetAllAsync(img => img.RoomId == detail.RoomId);
                            detail.Room.CategoryRoom = await _unitOfWork.CategoryRoom.GetAsync(c => c.Id == detail.Room.CategoryRoomId);
                        }
                    }
                }
                if (booking == null)
                {
                    throw new Exception("Not found");
                }
                var user = await _userManager.GetUserAsync(User);
                bool isAdmin = await _userManager.IsInRoleAsync(user, SD.Role_Admin);
                bool isStaff = await _userManager.IsInRoleAsync(user, SD.Role_Employee);

                if (isAdmin || isStaff || booking.PersonId == user.Id)
                {
                    _response.Result = _mapper.Map<BookingDTO>(booking);
                }
                else
                {
                    throw new Exception("User is unauthorized");
                }
                _response.StatusCode = HttpStatusCode.OK;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.ErrorMessages.Add(ex.Message);
                return BadRequest(_response);
            }
        }
        [HttpDelete]
        public async Task<ActionResult<APIResponse>> DeleteBooking(string userId, int bookingId)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                Booking booking = await _unitOfWork.Booking.GetAsync(u => u.Id == bookingId && u.PersonId == userId);
                if (booking == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Not Found");
                    return NotFound(_response);
                }
                await _unitOfWork.Booking.RemoveAsync(booking);
                _response.StatusCode = HttpStatusCode.NoContent;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages.Add(ex.Message);
                _response.StatusCode = HttpStatusCode.BadRequest;
                return BadRequest(_response);
            }
        }
        private bool IsValidStatusTransition(string currentStatus, string desiredStatus)
        {
            return currentStatus switch
            {
                "Pending" => desiredStatus == "Confirmed" || desiredStatus == "Cancelled",
                "Confirmed" => desiredStatus == "Ongoing",
                "Ongoing" => desiredStatus == "Completed",
                _ => false
            };
        }
        [HttpPut("UpdateStatus")]
        public async Task<ActionResult<APIResponse>> BookingUpdateStatus(int bookingId, string nextStatus)
        {
            try
            {
                var booking = await _unitOfWork.Booking.GetAsync(b => b.Id == bookingId);
                if (booking == null)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.ErrorMessages.Add("Không tìm thấy đơn đặt phòng.");
                    return NotFound(_response);
                }

                if (!IsValidStatusTransition(booking.BookingStatus, nextStatus))
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.ErrorMessages.Add($"Không thể chuyển từ trạng thái '{booking.BookingStatus}' sang '{nextStatus}'.");
                    return BadRequest(_response);
                }

                booking.BookingStatus = nextStatus;
                booking.UpdateBookingDate = DateTime.Now;
                await _unitOfWork.Booking.UpdateAsync(booking);

                _response.Result = booking;
                _response.StatusCode = HttpStatusCode.OK;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.ErrorMessages.Add(ex.Message);
                return BadRequest(_response);
            }
        }



    }

}
