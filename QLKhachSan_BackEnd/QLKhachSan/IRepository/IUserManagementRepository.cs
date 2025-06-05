
using QLKhachSan.Models;

namespace QLKhachSan.Repository.IRepository
{
    public interface IUserManagementRepository : IRepository<Person>
    {
        Task<Person> UpdateAsync(Person applicationUser);
    }
}
