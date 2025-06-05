using QLKhachSan.Models;

namespace QLKhachSan.Repository.IRepository
{
    public interface IBookingRoomRepository : IRepository<BookingRoom>
    {
        Task<BookingRoom> UpdateAsync(BookingRoom entity);
    }
}
