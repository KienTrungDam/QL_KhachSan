using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.IdentityModel.Tokens;
using QLKhachSan.Data;
using QLKhachSan.IRepository;
using QLKhachSan.Models;
using QLKhachSan.Models.DTO;
using QLKhachSan.Repository.IRepository;
using QLKhachSan.Utility;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace QLKhachSan.Controllers
{
    [Route("api/Auth")]
    [ApiController]
    public class AuthAPIController : ControllerBase
    {
        private readonly APIResponse _response;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailSender _emailSender;
        private readonly UserManager<Person> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthAPIController(IMapper mapper, IUnitOfWork unitOfWork, UserManager<Person> userManager, RoleManager<IdentityRole> roleManager, IEmailSender emailSender)
        {
            _emailSender = emailSender;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
                _response = new();
            _userManager = userManager;
            _roleManager = roleManager;
        }
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
        {
            LoginResponseDTO loginResponseDTO = await _unitOfWork.User.LoginAsync(loginRequestDTO);
            if (loginResponseDTO == null || loginResponseDTO.user == null)
            {
                return BadRequest(new
                {
                    isSuccess = false,
                    message = "Sai tài khoản hoặc mật khẩu"
                });
            }
            var user = _mapper.Map<Person>(loginResponseDTO.user);
            var role = await _userManager.GetRolesAsync(user);

            loginResponseDTO.user.Role = role.FirstOrDefault();
            try
            {
                if (loginResponseDTO == null)
                {
                    throw new Exception("UserName or Password is incorrect");
                }
                _response.Result = loginResponseDTO;
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
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Register([FromBody] RegisterRequestDTO registerRequestDTO)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(registerRequestDTO.UserName);
                //bool valid = _unitOfWork.User.UniqueUserName(registerRequestDTO.UserName);   
                if (user == null)
                {
                    if(registerRequestDTO.Role != SD.Role_Admin && registerRequestDTO.Role != SD.Role_Employee)
                    {
                        registerRequestDTO.Role = SD.Role_Customer;
                    }
                    
                    PersonDTO userDTO = await _unitOfWork.User.RegisterAsync(registerRequestDTO);
                    if (userDTO == null)
                    {
                        throw new Exception("Error while registering");
                    }
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.Result = userDTO;
                    return Ok(_response);
                }
                else
                {
                    throw new Exception("UserName is already exist");
                }
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.ErrorMessages.Add(ex.Message);
                return BadRequest(_response);
            }
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO model)
        {
            if (string.IsNullOrWhiteSpace(model.Email))
                return BadRequest("Email không được bỏ trống.");

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Tránh lộ thông tin người dùng
                return Ok(new { message = "Nếu email tồn tại, hệ thống sẽ gửi mã khôi phục." });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var resetUrl = $"http://localhost:5173/reset-password?email={model.Email}&token={encodedToken}";

            var subject = "Yêu cầu khôi phục mật khẩu";
            var body = $@"
        <p>Xin chào {user.UserName},</p>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào liên kết dưới đây để thực hiện:</p>
        <p><a href='{resetUrl}'>Đặt lại mật khẩu</a></p>
        <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>";

            try
            {
                await _emailSender.SendEmailAsync(model.Email, subject, body);
            }
            catch (Exception ex)
            {
                // Log lỗi gửi mail (tùy bạn dùng logger nào)
                Console.WriteLine($"Gửi email thất bại: {ex.Message}");
            }

            return Ok(new { message = "Nếu email tồn tại, hướng dẫn khôi phục đã được gửi." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO model)
        {
            if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Token) || string.IsNullOrWhiteSpace(model.NewPassword))
                return BadRequest("Thiếu thông tin.");

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return BadRequest("Người dùng không tồn tại.");

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));
            var result = await _userManager.ResetPasswordAsync(user, decodedToken, model.NewPassword);

            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));

            return Ok(new { message = "Đặt lại mật khẩu thành công." });
        }


    }
}
