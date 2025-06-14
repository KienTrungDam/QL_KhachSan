using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLKhachSan.Models;
using QLKhachSan.Models.DTO;
using QLKhachSan.Repository.IRepository;
using QLKhachSan.Utility;
using System.Net;

namespace QLKhachSan.Controllers
{
    [Route("api/CategoryRoom")]
    [ApiController]
    public class CategoryRoomAPIController : ControllerBase
    {
        protected APIResponse _response;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public CategoryRoomAPIController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _response = new APIResponse();
        }
        [HttpGet]
        //[Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<APIResponse>> GetCategoryRooms()
        {
            IEnumerable<CategoryRoom> categoryRooms = await _unitOfWork.CategoryRoom.GetAllAsync();
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<IEnumerable<CategoryRoomDTO>>(categoryRooms);
            return Ok(_response);
        }
        [HttpGet("{id:int}", Name = "GetCategoryRoom")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        //[Authorize(Roles = SD.Role_Customer)]
        public async Task<ActionResult<APIResponse>> GetCategoryRoom(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid Category ID");
                return BadRequest(_response);
            }
            CategoryRoom categoryRoom = await _unitOfWork.CategoryRoom.GetAsync(u => u.Id == id);
            if (categoryRoom == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return NotFound(_response);
            }
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<CategoryRoomDTO>(categoryRoom);
            return Ok(_response);
        }
        [HttpPost]
        [Authorize(Roles = SD.Role_Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> CreateCategoryRoom([FromForm] CategoryRoomCreateDTO categoryRoomCreateDTO)
        {
            var temp = await _unitOfWork.CategoryRoom.GetAsync(u => u.Name == categoryRoomCreateDTO.Name);
            if (temp != null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Name is already exist");
                return BadRequest(_response);
            }
            if (categoryRoomCreateDTO == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return BadRequest(_response);
            }
            var categoryRoom = _mapper.Map<CategoryRoom>(categoryRoomCreateDTO);
            await _unitOfWork.CategoryRoom.CreateAsync(categoryRoom);
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<CategoryRoomDTO>(categoryRoom);

            return CreatedAtRoute("GetCategoryRoom", new { id = categoryRoom.Id }, _response);
        }
        [HttpPut("{id:int}", Name = "UpdateCategoryRoom")]
        [Authorize(Roles = SD.Role_Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> UpdateCategoryRoom(int id, [FromForm] CategoryRoomUpdateDTO categoryRoomUpdateDTO)
        {
            if (id != categoryRoomUpdateDTO.Id || categoryRoomUpdateDTO == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return BadRequest();
            }
            CategoryRoom categoryRoom = _mapper.Map<CategoryRoom>(categoryRoomUpdateDTO);
            await _unitOfWork.CategoryRoom.UpdateAsync(categoryRoom);
            _response.StatusCode = HttpStatusCode.NoContent;
            return Ok(_response);
        }
        [HttpDelete("{id:int}", Name = "DeleteCategoryRoom")]
        [Authorize(Roles = SD.Role_Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> DeleteCategoryRoom(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Id = 0 Ivalid");
                return BadRequest();
            }
            CategoryRoom categoryRoom = await _unitOfWork.CategoryRoom.GetAsync(u => u.Id == id);
            if (categoryRoom == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return NotFound();
            }
            await _unitOfWork.CategoryRoom.RemoveAsync(categoryRoom);
            _response.StatusCode = HttpStatusCode.NoContent;
            return Ok(_response);
        }
    }
}
