using QLKhachSan.Models;

namespace QLKhachSan.Repository.IRepository
{
    public interface IRoomRepository : IRepository<Room>
    {
        Task<Room> UpdateAsync(Room entity);
    }
}
