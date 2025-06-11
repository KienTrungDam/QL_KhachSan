using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using QLKhachSan.Models;
using QLKhachSan.Models.DTO;
using QLKhachSan.Repository.IRepository;
using QLKhachSan.Utility;
using System.Net;

namespace QLKhachSan.Controllers
{
    [Route("api/Room")]
    [ApiController]
    public class RoomAPIController : ControllerBase
    {
        protected APIResponse _response;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public RoomAPIController(IUnitOfWork unitOfWork, IMapper mapper, IWebHostEnvironment webHostEnvironment)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _webHostEnvironment = webHostEnvironment;
            _response = new APIResponse();
        }
        [HttpGet]
        //[Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<APIResponse>> GetRooms()
        {
            var rooms = await _unitOfWork.Room.GetAllAsync(includeProperties: "CategoryRoom,RoomImages");

            _response.StatusCode = HttpStatusCode.OK;

            // Chuyển đổi dữ liệu của Room sang RoomDTO và bao gồm thông tin CategoryRoom
            _response.Result = _mapper.Map<IEnumerable<RoomDTO>>(rooms);

            return Ok(_response);
        }
        [HttpGet("{id:int}", Name = "GetRoom")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        //[Authorize(Roles = SD.Role_Customer)]
        public async Task<ActionResult<APIResponse>> GetRoom(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid Category ID");
                return BadRequest(_response);
            }
            Room room = await _unitOfWork.Room.GetAsync(u => u.Id == id, includeProperties: "CategoryRoom,RoomImages");
            if (room == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return NotFound(_response);
            }
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<RoomDTO>(room);
            return Ok(_response);
        }
        [HttpPost]
        //[Authorize(Roles = SD.Role_Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> CreateRoom([FromForm] RoomCreateDTO roomCreateDTO)
        {
            
            if (roomCreateDTO == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return BadRequest(_response);
            }
            roomCreateDTO.CreatedAt = DateTime.UtcNow;
            roomCreateDTO.UpdatedAt = DateTime.UtcNow;
            var room = _mapper.Map<Room>(roomCreateDTO);
            await _unitOfWork.Room.CreateAsync(room);
            string wwwRootPath = _webHostEnvironment.WebRootPath;
            if (roomCreateDTO.MainImage != null)
            {
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(roomCreateDTO.MainImage.FileName);
                string roomPath = @"images\rooms\room-" + room.Id;
                string finalPath = Path.Combine(wwwRootPath, roomPath);

                if (!Directory.Exists(finalPath))
                    Directory.CreateDirectory(finalPath);

                using (var fileStream = new FileStream(Path.Combine(finalPath, fileName), FileMode.Create))
                {
                    await roomCreateDTO.MainImage.CopyToAsync(fileStream);
                }

                RoomImage mainImage = new()
                {
                    ImageUrl = @"\" + roomPath + @"\" + fileName,
                    RoomId = room.Id,
                    IsMain = true
                };

                await _unitOfWork.RoomImage.CreateAsync(mainImage);
            }
            if (roomCreateDTO.Images != null)
            {

                foreach (IFormFile image in roomCreateDTO.Images)
                {
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                    string toomPath = @"images\rooms\room-" + room.Id;
                    string finalPath = Path.Combine(wwwRootPath, toomPath);

                    if (!Directory.Exists(finalPath))
                        Directory.CreateDirectory(finalPath);

                    using (var fileStream = new FileStream(Path.Combine(finalPath, fileName), FileMode.Create))
                    {
                        await image.CopyToAsync(fileStream);
                    }

                    RoomImage roomImage = new()
                    {
                        ImageUrl = @"\" + toomPath + @"\" + fileName,
                        RoomId = room.Id,
                        IsMain = false
                    };
                    await _unitOfWork.RoomImage.CreateAsync(roomImage);
                }
            }
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<RoomDTO>(room);

            return CreatedAtRoute("GetRoom", new { id = room.Id }, _response);
        }
        [HttpPut("{id:int}", Name = "UpdateRoom")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> UpdateRoom(int id, [FromForm] RoomUpdateDTO roomUpdateDTO)
        {
            if (id != roomUpdateDTO.Id || roomUpdateDTO == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return BadRequest();
            }

            roomUpdateDTO.UpdatedAt = DateTime.UtcNow;
            Room room = _mapper.Map<Room>(roomUpdateDTO);
            

            string wwwRootPath = _webHostEnvironment.WebRootPath;

            // Lấy ảnh hiện tại của phòng từ DB
            var existingImages = await _unitOfWork.RoomImage.GetAllAsync(i => i.RoomId == room.Id);

            // --- XỬ LÝ ẢNH CHÍNH ---
            if (roomUpdateDTO.MainImage != null)
            {
                // Xoá ảnh chính cũ nếu có
                var oldMainImage = existingImages.FirstOrDefault(i => i.IsMain);
                if (oldMainImage != null)
                {
                    await _unitOfWork.RoomImage.RemoveAsync(oldMainImage);

                    // Xoá file vật lý
                    string oldPath = Path.Combine(wwwRootPath, oldMainImage.ImageUrl.TrimStart('\\'));
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                // Lưu ảnh chính mới
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(roomUpdateDTO.MainImage.FileName);
                string roomPath = @"images\rooms\room-" + room.Id;
                string finalPath = Path.Combine(wwwRootPath, roomPath);

                if (!Directory.Exists(finalPath))
                    Directory.CreateDirectory(finalPath);

                using (var fileStream = new FileStream(Path.Combine(finalPath, fileName), FileMode.Create))
                {
                    await roomUpdateDTO.MainImage.CopyToAsync(fileStream);
                }

                RoomImage mainImage = new()
                {
                    ImageUrl = @"\" + roomPath + @"\" + fileName,
                    RoomId = room.Id,
                    IsMain = true
                };

                await _unitOfWork.RoomImage.CreateAsync(mainImage);
            }

            // --- XỬ LÝ ẢNH PHỤ ---
            if (roomUpdateDTO.Images != null && roomUpdateDTO.Images.Any())
            {
                foreach (IFormFile image in roomUpdateDTO.Images)
                {
                    // Kiểm tra trùng tên file (không thêm nếu đã tồn tại)
                    string originalFileName = Path.GetFileName(image.FileName);
                    bool isDuplicate = existingImages.Any(img => !img.IsMain && Path.GetFileName(img.ImageUrl) == originalFileName);
                    if (isDuplicate)
                        continue;

                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                    string roomPath = @"images\rooms\room-" + room.Id;
                    string finalPath = Path.Combine(wwwRootPath, roomPath);

                    if (!Directory.Exists(finalPath))
                        Directory.CreateDirectory(finalPath);

                    using (var fileStream = new FileStream(Path.Combine(finalPath, fileName), FileMode.Create))
                    {
                        await image.CopyToAsync(fileStream);
                    }

                    RoomImage roomImage = new()
                    {
                        ImageUrl = @"\" + roomPath + @"\" + fileName,
                        RoomId = room.Id,
                        IsMain = false
                    };

                    await _unitOfWork.RoomImage.CreateAsync(roomImage);
                }
            }
            await _unitOfWork.Room.UpdateAsync(room);
            _response.Result = _mapper.Map<RoomDTO>(room);
            _response.StatusCode = HttpStatusCode.NoContent;
            return Ok(_response);
        }

        [HttpDelete("{id:int}", Name = "DeleteRoom")]
        //[Authorize(Roles = SD.Role_Admin)]    
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> DeleteRoom(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Id = 0 Ivalid");
                return BadRequest();
            }
            Room room = await _unitOfWork.Room.GetAsync(u => u.Id == id);
            if (room == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return NotFound();
            }
            await _unitOfWork.Room.RemoveAsync(room);
            _response.StatusCode = HttpStatusCode.NoContent;
            return Ok(_response);
        }
        private async Task DeleteRoomImages(int roomId)
        {
            string wwwRootPath = _webHostEnvironment.WebRootPath;
            var images = await _unitOfWork.RoomImage.GetAllAsync(i => i.RoomId == roomId);

            foreach (var image in images)
            {
                string fullPath = Path.Combine(wwwRootPath, image.ImageUrl.TrimStart('\\'));
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
                _unitOfWork.RoomImage.RemoveAsync(image);
            }

            await _unitOfWork.SaveAsync();
        }
        [HttpGet("available")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<APIResponse>> GetAvailableRooms(DateTime checkin, DateTime checkout, int people)
        {
            DateTime checkinDate = checkin.Date;
            DateTime checkoutDate = checkout.Date;

            if (checkinDate >= checkoutDate || people <= 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Ngày check-out phải sau ngày check-in và số người phải lớn hơn 0.");
                return BadRequest(_response);
            }

            // Lấy tất cả phòng phù hợp với số người
            var allRooms = await _unitOfWork.Room.GetAllAsync(
                r => r.MaxOccupancy >= people,
                includeProperties: "CategoryRoom,RoomImages"
            );

            // Lấy các booking chưa bị huỷ và có BookingRoom
            var bookings = await _unitOfWork.Booking.GetAllAsync(
                b => b.BookingStatus != SD.Status_Booking_Cancelled && b.BookingStatus != SD.Status_Booking_Completed && b.BookingRoomId != null,
                includeProperties: "BookingRoom.BookingRoomDetails"
            );

            // Lấy tất cả các BookingRoomDetail bị giao thời gian với yêu cầu
            var overlappingDetails = bookings
                .SelectMany(b => b.BookingRoom.BookingRoomDetails)
                .Where(d =>
                    d.CheckInDate.HasValue && d.CheckOutDate.HasValue &&
                    !(d.CheckOutDate.Value.Date <= checkinDate || d.CheckInDate.Value.Date >= checkoutDate)
                )
                .ToList();

            // Lấy danh sách các RoomId đã bị đặt
            var bookedRoomIds = overlappingDetails.Select(d => d.RoomId).Distinct().ToList();

            // Lọc ra các phòng còn trống
            var availableRooms = allRooms.Where(r => !bookedRoomIds.Contains(r.Id)).ToList();

            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<IEnumerable<RoomDTO>>(availableRooms);
            return Ok(_response);
        }
        [HttpGet("ListBookingDate/{roomId:int}")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> GetRoomBookedDates(int roomId)
        {
            if (roomId <= 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Room ID không hợp lệ.");
                return BadRequest(_response);
            }

            // Kiểm tra phòng có tồn tại không
             var room = await _unitOfWork.Room.GetAsync(r => r.Id == roomId);
            if (room == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không tìm thấy phòng.");
                return NotFound(_response);
            }

            // Lấy danh sách các booking hợp lệ có liên quan đến phòng
            var bookings = await _unitOfWork.Booking.GetAllAsync(
                b => b.BookingStatus != SD.Status_Booking_Cancelled && b.BookingStatus != SD.Status_Booking_Completed && b.BookingRoomId > 0,
                includeProperties: "BookingRoom"
            );
            foreach (var booking in bookings)
            {
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

            var bookedDates = bookings
            .SelectMany(b => b.BookingRoom.BookingRoomDetails)
            .Where(d => d.RoomId == roomId && d.CheckInDate.HasValue && d.CheckOutDate.HasValue)
            .Select(d => new
            {
                CheckIn = d.CheckInDate.Value.Date,
                CheckOut = d.CheckOutDate.Value.Date
            }).ToList();
            
            _response.Result = bookedDates;
            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }





    }

}
