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
    [Route("api/New")]
    [ApiController]
    public class NewAPIController : ControllerBase
    {
        protected APIResponse _response;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IUnitOfWork _unitOfWork;

        public NewAPIController(IUnitOfWork unitOfWork, IMapper mapper, IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _response = new APIResponse();
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<APIResponse>> GetNews()
        {
            var news = await _unitOfWork.New.GetAllAsync();
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<IEnumerable<NewDTO>>(news);
            return Ok(_response);
        }

        [HttpGet("{id:int}", Name = "GetNew")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> GetNew(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Id không hợp lệ.");
                return BadRequest(_response);
            }

            var newItem = await _unitOfWork.New.GetAsync(n => n.Id == id);
            if (newItem == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Không tìm thấy tin tức.");
                return NotFound(_response);
            }

            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<NewDTO>(newItem);
            return Ok(_response);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<APIResponse>> CreateNew([FromForm] NewCreateDTO newCreateDTO)
        {
            if (newCreateDTO == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid input");
                return BadRequest(_response);
            }

            var newEntity = _mapper.Map<New>(newCreateDTO);
            newEntity.CreatedAt = DateTime.UtcNow;
            newEntity.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.New.CreateAsync(newEntity);
            await _unitOfWork.SaveAsync();

            // Lưu ảnh vào wwwroot/images/new
            if (newCreateDTO.Image != null)
            {
                string wwwRootPath = _webHostEnvironment.WebRootPath;
                string folderPath = Path.Combine(wwwRootPath, "images", "new");

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string fileName = $"new-{newEntity.Id}{Path.GetExtension(newCreateDTO.Image.FileName)}";
                string filePath = Path.Combine(folderPath, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await newCreateDTO.Image.CopyToAsync(fileStream);
                }

                newEntity.ImageUrl = Path.Combine("images", "new", fileName).Replace("\\", "/");
                await _unitOfWork.New.UpdateAsync(newEntity);
                await _unitOfWork.SaveAsync();
            }

            _response.StatusCode = HttpStatusCode.Created;
            _response.Result = _mapper.Map<NewDTO>(newEntity);
            return CreatedAtRoute("GetNew", new { id = newEntity.Id }, _response);
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<APIResponse>> UpdateNew(int id, [FromForm] NewUpdateDTO newUpdateDTO)
        {
            if (newUpdateDTO == null || id != newUpdateDTO.Id)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid input");
                return BadRequest(_response);
            }

            var existingNew = await _unitOfWork.New.GetAsync(u => u.Id == id);
            if (existingNew == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("New not found");
                return NotFound(_response);
            }

            existingNew.Title = newUpdateDTO.Title;
            existingNew.Content = newUpdateDTO.Content;
            existingNew.UpdatedAt = DateTime.UtcNow;

            // Nếu có ảnh mới, lưu ảnh và xóa ảnh cũ
            if (newUpdateDTO.Image != null)
            {
                string wwwRootPath = _webHostEnvironment.WebRootPath;

                if (!string.IsNullOrEmpty(existingNew.ImageUrl))
                {
                    string oldImagePath = Path.Combine(wwwRootPath, existingNew.ImageUrl.Replace("/", "\\"));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                string folderPath = Path.Combine(wwwRootPath, "images", "new");
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string fileName = $"new-{existingNew.Id}{Path.GetExtension(newUpdateDTO.Image.FileName)}";
                string filePath = Path.Combine(folderPath, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await newUpdateDTO.Image.CopyToAsync(fileStream);
                }

                existingNew.ImageUrl = Path.Combine("images", "new", fileName).Replace("\\", "/");
            }

            await _unitOfWork.New.UpdateAsync(existingNew);
            await _unitOfWork.SaveAsync();

            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<NewDTO>(existingNew);
            return Ok(_response);
        }


        [HttpDelete("{id:int}")]
        [Authorize(Roles = SD.Role_Admin)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> DeleteNew(int id)
        {
            var existingNew = await _unitOfWork.New.GetAsync(n => n.Id == id);
            if (existingNew == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Tin tức không tồn tại.");
                return NotFound(_response);
            }

            await _unitOfWork.New.RemoveAsync(existingNew);
            await _unitOfWork.SaveAsync();

            _response.StatusCode = HttpStatusCode.NoContent;
            return Ok(_response);
        }
    }
}
