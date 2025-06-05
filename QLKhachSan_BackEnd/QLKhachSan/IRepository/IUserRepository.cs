using QLKhachSan.Models.DTO;

namespace QLKhachSan.IRepository
{
    public interface IUserRepository
    {
        bool UniqueUserName(string userName);
        Task<LoginResponseDTO> LoginAsync(LoginRequestDTO loginRequestDTO);
        Task<PersonDTO> RegisterAsync(RegisterRequestDTO registerRequestDTO);
    }
}
