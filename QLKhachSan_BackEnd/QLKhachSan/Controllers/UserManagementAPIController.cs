using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;
using QLKhachSan.Utility;
using QLKhachSan.Models.DTO;

namespace QLKhachSan.Controllers
{
    [Route("api/UserManagement")]
    [ApiController]
    [Authorize]
    public class UserManagementAPIController : ControllerBase
    {
        protected APIResponse _response;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly UserManager<Person> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public UserManagementAPIController(IUnitOfWork unitOfWork, IMapper mapper, UserManager<Person> uuserManager, RoleManager<IdentityRole> roleManager)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _response = new();
            _userManager = uuserManager;
            _roleManager = roleManager;
        }
        [HttpGet]
        //[Authorize(Roles = SD.Role_Admin)]
        //[ResponseCache(Duration = 30)]//khi thuc hien get villas giong nhau trong 30s cac hanh dong tiep theo se lay du lieu tu lan 1 vaf ko can goi api 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<APIResponse>> GetUsers()
        {
            IEnumerable<Person> users = await _userManager.Users.ToListAsync();
            var user = await _userManager.GetUserAsync(User);
            bool isStaff = await _userManager.IsInRoleAsync(user, SD.Role_Employee);
            foreach (var item in users)
            {
                item.Role = (await _userManager.GetRolesAsync(item)).FirstOrDefault();
            }
            if (isStaff)
            {
                users = users.Where(u => u.Role == SD.Role_Employee || u.Role == SD.Role_Customer);
            }
            _response.Result = _mapper.Map<List<PersonDTO>>(users);
            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }
        [HttpGet("UserName/{UserName}", Name = "GetUserByUserName")]
        public async Task<ActionResult<APIResponse>> GetUserByUserName(string UserName)
        {
            try
            {
                if (UserName == null)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    return BadRequest(_response);
                }
                Person users = await _unitOfWork.UserManagement.GetAsync(u => u.UserName.ToLower() == UserName.ToLower());
                if (users == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    return NotFound(_response);
                }
                users.Role = (await _userManager.GetRolesAsync(users)).FirstOrDefault();
                _response.Result = _mapper.Map<PersonDTO>(users);
                _response.StatusCode = HttpStatusCode.OK;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string>() { ex.ToString() };
                _response.StatusCode = HttpStatusCode.BadRequest;
            }
            return _response;
        }
        [HttpGet("Id/{Id}", Name = "GetUserById")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<APIResponse>> GetUserById(string Id)
        {
            try
            {
                if (Id == null)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    return BadRequest(_response);
                }
                Person users = await _unitOfWork.UserManagement.GetAsync(u => u.Id.ToLower() == Id.ToLower());
                if (users == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    return NotFound(_response);
                }
                users.Role = (await _userManager.GetRolesAsync(users)).FirstOrDefault();
                _response.Result = _mapper.Map<PersonDTO>(users);
                _response.StatusCode = HttpStatusCode.OK;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string>() { ex.ToString() };
                _response.StatusCode = HttpStatusCode.BadRequest;
            }
            return _response;
        }
        [HttpDelete("{id}", Name = "DeleteUser")]
        //[Authorize(Roles = SD.Role_Admin)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<APIResponse>> DeleteUser(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest();
                }
                var user = await _unitOfWork.UserManagement.GetAsync(u => u.Id == id);
                if (user == null)
                {
                    return NotFound();
                }
                await _unitOfWork.UserManagement.RemoveAsync(user);
                _response.StatusCode = HttpStatusCode.NoContent;
                _response.IsSuccess = true;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string>() { ex.ToString() };

            }
            return _response;
        }

        [HttpPost]
        //[Authorize(Roles = SD.Role_Admin)]
        public async Task<ActionResult<APIResponse>> CreateUser([FromForm] RegisterRequestDTO requestDTO)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(requestDTO.UserName);

                if (user != null)
                {
                    throw new Exception("UserName exists");
                }

                var personDTO = await _unitOfWork.User.RegisterAsync(requestDTO);   

                if (personDTO == null)
                {
                    throw new Exception("Error while registering");
                }
                _response.Result = personDTO;
                _response.StatusCode = HttpStatusCode.OK;
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
        [HttpPut("{id}", Name = "UpdateRoleToUser")]
        [Authorize(Roles = SD.Role_Admin)]
        public async Task<ActionResult<APIResponse>> UpdateRoleToUser(string id, string role)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                var rolecurrent = await _userManager.GetRolesAsync(user);
                if (user == null)
                {
                    throw new Exception("User does not exists");
                }
                if(role != rolecurrent.FirstOrDefault())
                {
                    bool isValid = await _roleManager.RoleExistsAsync(role);
                    if (isValid)
                    {
                        await _userManager.RemoveFromRolesAsync(user, rolecurrent);
                        await _userManager.AddToRoleAsync(user, role);
                    }
                    else
                    {
                        throw new Exception("Role is not valid");
                    }
                }
                var personDTO = _mapper.Map<PersonDTO>(user);
                personDTO.Role = role;
                _response.Result = personDTO;
                _response.StatusCode = HttpStatusCode.OK;
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
        [HttpPost("LockUnlock")]
        //[Authorize(Roles = SD.Role_Admin)]
        public async Task<ActionResult<APIResponse>> LockUnlock(string id)
        {

            var objFromDb = await _userManager.FindByIdAsync(id);
            if (objFromDb == null)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Error while Locking/Unlocking");
                _response.StatusCode = HttpStatusCode.BadRequest;
                return BadRequest(_response);
            }

            if (objFromDb.LockoutEnd != null && objFromDb.LockoutEnd > DateTime.Now)
            {
                //user is currently locked and we need to unlock them
                objFromDb.LockoutEnd = DateTime.Now;
            }
            else
            {
                objFromDb.LockoutEnd = DateTime.Now.AddYears(1000);
            }
            await _unitOfWork.SaveAsync();
            _response.StatusCode = HttpStatusCode.NoContent;
            return Ok(_response);
        }
        [HttpPut("UpdateUser/{id}", Name = "UpdateUser")]
        [Authorize(Roles = SD.Role_Admin + "," + SD.Role_Employee)]
        public async Task<ActionResult<APIResponse>> UpdateUser(string id, [FromBody] PersonUpdateDTO personUpdateDTO)
        {
            try
            {
                if (personUpdateDTO == null || string.IsNullOrEmpty(id))
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Invalid user data");
                    return BadRequest(_response);
                }

                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("User not found");
                    return NotFound(_response);
                }

                // Cập nhật thông tin
                user.FirstMidName = personUpdateDTO.FirstMidName;
                user.LastName = personUpdateDTO.LastName;
                user.Address = personUpdateDTO.Address;
                user.CCCD = personUpdateDTO.CCCD;

                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    foreach (var error in result.Errors)
                    {
                        _response.ErrorMessages.Add(error.Description);
                    }
                    return BadRequest(_response);
                }

                // Cập nhật vai trò nếu cần
                var currentRoles = await _userManager.GetRolesAsync(user);
                var currentRole = currentRoles.FirstOrDefault();

                if (!string.IsNullOrEmpty(personUpdateDTO.Role) && personUpdateDTO.Role != currentRole)
                {
                    if (currentRole != null)
                    {
                        await _userManager.RemoveFromRoleAsync(user, currentRole);
                    }

                    var roleExists = await _roleManager.RoleExistsAsync(personUpdateDTO.Role);
                    if (roleExists)
                    {
                        await _userManager.AddToRoleAsync(user, personUpdateDTO.Role);
                    }
                    else
                    {
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.IsSuccess = false;
                        _response.ErrorMessages.Add("Vai trò không tồn tại");
                        return BadRequest(_response);
                    }
                }

                var personDto = _mapper.Map<PersonDTO>(user);
                personDto.Role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();
                _response.Result = personDto;
                _response.StatusCode = HttpStatusCode.OK;
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



    }
}
