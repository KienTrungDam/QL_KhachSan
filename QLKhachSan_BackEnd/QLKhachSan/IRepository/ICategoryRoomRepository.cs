using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;

namespace QLKhachSan.Repository.IRepository
{
    public interface ICategoryRoomRepository : IRepository<CategoryRoom>
    {
        Task<CategoryRoom> UpdateAsync(CategoryRoom entity);
    }
}
