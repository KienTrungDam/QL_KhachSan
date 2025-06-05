using QLKhachSan.Models;

namespace QLKhachSan.Repository.IRepository
{
    public interface IRoomImageRepository : IRepository<RoomImage>
    {
        Task<RoomImage> UpdateAsync(RoomImage entity);
    }
}
