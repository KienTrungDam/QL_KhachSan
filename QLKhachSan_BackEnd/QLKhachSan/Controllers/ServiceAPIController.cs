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
    [Route("api/Service")]
    [ApiController]
    public class ServiceAPIController : ControllerBase
    {
        protected APIResponse _response;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public ServiceAPIController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _response = new APIResponse();
        }
        [HttpGet]
        //[Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<APIResponse>> GetServices()
        {
            IEnumerable<Service> services = await _unitOfWork.Service.GetAllAsync();
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<IEnumerable<ServiceDTO>>(services);
            return Ok(_response);
        }
        [HttpGet("{id:int}", Name = "GetService")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        //[Authorize(Roles = SD.Role_Customer)]
        public async Task<ActionResult<APIResponse>> GetService(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid Category ID");
                return BadRequest(_response);
            }
            Service service = await _unitOfWork.Service.GetAsync(u => u.Id == id);
            if (service == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return NotFound(_response);
            }
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<ServiceDTO>(service);
            return Ok(_response);
        }
        [HttpPost]
        //[Authorize(Roles = SD.Role_Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> CreateService([FromForm] ServiceCreateDTO serviceCreateDTO)
        {
            var temp = await _unitOfWork.Service.GetAsync(u => u.Name == serviceCreateDTO.Name);
            if (temp != null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Name is already exist");
                return BadRequest(_response);
            }
            if (serviceCreateDTO == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return BadRequest(_response);
            }
            var service = _mapper.Map<Service>(serviceCreateDTO);
            await _unitOfWork.Service.CreateAsync(service);
            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = _mapper.Map<ServiceDTO>(service);

            return CreatedAtRoute("GetService", new { id = service.Id }, _response);
        }
        [HttpPut("{id:int}", Name = "UpdateService")]
        //[Authorize(Roles = SD.Role_Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> UpdateService(int id, [FromForm] ServiceUpdateDTO serviceUpdateDTO)
        {
            if (id != serviceUpdateDTO.Id || serviceUpdateDTO == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return BadRequest();
            }
            Service service = _mapper.Map<Service>(serviceUpdateDTO);
            await _unitOfWork.Service.UpdateAsync(service);
            _response.StatusCode = HttpStatusCode.NoContent;
            return Ok(_response);
        }
        [HttpDelete("{id:int}", Name = "DeleteService")]
        //[Authorize(Roles = SD.Role_Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<APIResponse>> DeleteService(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Id = 0 Ivalid");
                return BadRequest();
            }
            Service service = await _unitOfWork.Service.GetAsync(u => u.Id == id);
            if (service == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Not Found");
                return NotFound();
            }
            await _unitOfWork.Service.RemoveAsync(service);
            _response.StatusCode = HttpStatusCode.NoContent;
            return Ok(_response);
        }
    }
}
