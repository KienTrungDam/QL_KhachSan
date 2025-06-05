using QLKhachSan.Models;

namespace QLKhachSan.Repository.IRepository
{
    public interface IBookingRoomDetailRepository : IRepository<BookingRoomDetail>
    {
        Task<BookingRoomDetail> UpdateAsync(BookingRoomDetail entity);
    }
}
