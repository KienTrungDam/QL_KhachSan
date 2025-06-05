using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using QLKhachSan.Models.DTO;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;
using System.Net;

namespace QLKhachSan.Controllers
{
    [Route("api/BookingRoomDetail")]
    [ApiController]
    public class BookingRoomDetailController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        protected APIResponse _response;
        private readonly UserManager<Person> _userManager;
        public BookingRoomDetailController(IUnitOfWork unitOfWork, IMapper mapper, UserManager<Person> userManager)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _response = new APIResponse();
            _userManager = userManager;
        }
        [HttpGet("{id:int}", Name = "GetBookRoomDetail")]
        public async Task<ActionResult<APIResponse>> GetBookRoomDetail(int id)
        {
            if (id == 0)            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid BookingRoomDetail ID");
                return BadRequest(_response);
            }
            BookingRoomDetail bookingRoomDetail = await _unitOfWork.BookingRoomDetail.GetAsync(u => u.Id == id, includeProperties: "Room");
            if (bookingRoomDetail == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return NotFound(_response);
            }
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<BookingRoomDetailDTO>(bookingRoomDetail);
            return Ok(_response);
        }
    }
}
