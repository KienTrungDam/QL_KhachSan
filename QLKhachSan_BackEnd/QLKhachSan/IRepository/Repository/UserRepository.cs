using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using QLKhachSan.Data;
using QLKhachSan.Models;
using QLKhachSan.Models.DTO;
using QLKhachSan.Utility;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace QLKhachSan.IRepository.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<Person> _userManager;
        private string _secretKey;
        public UserRepository(ApplicationDbContext db, UserManager<Person> userManager, RoleManager<IdentityRole> roleManager, IMapper mapper, IConfiguration configuration)
        {
            _db = db;
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
            _secretKey = configuration.GetValue<string>("ApiSettings:SecretKey");
        }

        public async Task<LoginResponseDTO> LoginAsync(LoginRequestDTO loginRequestDTO)
        {
            var user = await _userManager.FindByNameAsync(loginRequestDTO.UserName);
            bool ValidPassword = await _userManager.CheckPasswordAsync(user, loginRequestDTO.Password);
            if (!ValidPassword || user == null)
            {
                return null;
            }
            var role = await _userManager.GetRolesAsync(user);
            var token = GeneratedJWTToken(user, role.FirstOrDefault());
            return new LoginResponseDTO
            {
                Token = token,
                user = _mapper.Map<PersonDTO>(user),
            };

        }

        public async Task<PersonDTO> RegisterAsync(RegisterRequestDTO registerRequestDTO)
        {
            Person user = new Person
            {
                UserName = registerRequestDTO.UserName,
                Email = registerRequestDTO.Email,
                FirstMidName = registerRequestDTO.FirstMidName,
                LastName = registerRequestDTO.LastName,
                Address = registerRequestDTO.Address,
                NormalizedEmail = registerRequestDTO.UserName.ToUpper(),
                CCCD = registerRequestDTO.CCCD,

            };
            try
            {
                var create = await _userManager.CreateAsync(user, registerRequestDTO.Password);
                if (create.Succeeded)
                {
                    //Tao role truoc khi chua co role nao chi chay 1 lan
                    if (!_roleManager.RoleExistsAsync("Admin").GetAwaiter().GetResult())
                    {
                        await _roleManager.CreateAsync(new IdentityRole(SD.Role_Admin));
                        await _roleManager.CreateAsync(new IdentityRole(SD.Role_Employee));
                        await _roleManager.CreateAsync(new IdentityRole(SD.Role_Customer));
                    }
                    var getuser = _db.Persons.FirstOrDefault(u => u.UserName == registerRequestDTO.UserName);
                    var userDTO = _mapper.Map<PersonDTO>(getuser);
                    if (_roleManager.RoleExistsAsync(registerRequestDTO.Role).GetAwaiter().GetResult())
                    {
                        await _userManager.AddToRoleAsync(user, registerRequestDTO.Role);
                        userDTO.Role = registerRequestDTO.Role;
                    }
                    else
                    {
                        await _userManager.AddToRoleAsync(user, SD.Role_Customer);
                        userDTO.Role = SD.Role_Customer;
                    }
                    return userDTO;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {

            }
            return new PersonDTO();
        }

        public bool UniqueUserName(string userName)
        {
            var user = _db.Persons.FirstOrDefault(u => u.UserName == userName);
            if (user == null)
            {
                return true;
            }
            return false;
        }
        private string GeneratedJWTToken(Person user, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey); //key de ma hoa token - chuyen sang kieu byte
            //trong token co role va id cua user
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new Claim[]
               {
                   new Claim(ClaimTypes.Name, user.LastName),
                   new Claim(ClaimTypes.Role, role),
                   new Claim(ClaimTypes.NameIdentifier, user.Id),
                   new Claim(ClaimTypes.Email, user.Email)
               }),
                Expires = DateTime.UtcNow.AddDays(3),
                //xac dinh key và thuat toan ma hoa
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature) //ma hoa token
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}
