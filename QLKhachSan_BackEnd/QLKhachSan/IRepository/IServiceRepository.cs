using QLKhachSan.Models;

namespace QLKhachSan.Repository.IRepository
{
    public interface IServiceRepository : IRepository<Service>
    {
        Task<Service> UpdateAsync(Service entity);
    }
}
