using QLKhachSan.Models;

namespace QLKhachSan.Repository.IRepository
{
    public interface INewRepository : IRepository<New>
    {
        Task<New> UpdateAsync(New entity);
    }
}
