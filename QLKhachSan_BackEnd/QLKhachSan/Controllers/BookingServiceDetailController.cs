using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using QLKhachSan.Models;
using QLKhachSan.Models.DTO;
using QLKhachSan.Repository.IRepository;
using System.Net;

namespace QLKhachSan.Controllers
{
    [Route("api/BookingServiceDetail")]
    [ApiController]
    [Authorize]
    public class BookingServiceDetailController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        protected APIResponse _response;
        private readonly UserManager<Person> _userManager;
        public BookingServiceDetailController(IUnitOfWork unitOfWork, IMapper mapper, UserManager<Person> userManager)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _response = new APIResponse();
            _userManager = userManager;
        }
        [HttpGet("{id:int}", Name = "GetBookServiceDetail")]
        public async Task<ActionResult<APIResponse>> GetBookServiceDetail(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid BookingServiceDetail ID");
                return BadRequest(_response);
            }
            BookingServiceDetail bookingServiceDetail = await _unitOfWork.BookingServiceDetail.GetAsync(u => u.Id == id, includeProperties: "Service");
            if (bookingServiceDetail == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return NotFound(_response);
            }
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<BookingServiceDetailDTO>(bookingServiceDetail);
            return Ok(_response);
        }
    }
}
