using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;
using System.Net;

namespace QLKhachSan.Controllers
{
    [Route("api/RoomImage")]
    [ApiController]
    public class RoomImageController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        protected APIResponse _response;
        private readonly UserManager<Person> _userManager;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public RoomImageController(IUnitOfWork unitOfWork, IMapper mapper, UserManager<Person> userManager, IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _response = new APIResponse();
            _userManager = userManager;
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoomImage(int id)
        {
            var roomImage = await _unitOfWork.RoomImage.GetAsync(u => u.Id == id);
            if (roomImage == null)
            {
                _response.IsSuccess = false;
                _response.StatusCode = System.Net.HttpStatusCode.NotFound;
                _response.ErrorMessages.Add("Không tìm thấy ảnh.");
                return NotFound(_response);
            }
            var wwwRootPath = _webHostEnvironment.WebRootPath;
            // Xoá file vật lý nếu cần (nếu bạn lưu file ảnh trên ổ đĩa)
            var relativePath = roomImage.ImageUrl.TrimStart('\\', '/')
                        .Replace('\\', Path.DirectorySeparatorChar)
                        .Replace('/', Path.DirectorySeparatorChar);
            var imagePath = Path.Combine(wwwRootPath, relativePath);
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }

            await _unitOfWork.RoomImage.RemoveAsync(roomImage);

            _response.IsSuccess = true;
            _response.StatusCode = HttpStatusCode.NoContent;
            return Ok(_response);
        }

    }

}
