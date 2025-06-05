using QLKhachSan.Models;

namespace QLKhachSan.Repository.IRepository
{
    public interface IBookingRepository : IRepository<Booking>
    {
        Task<Booking> UpdateAsync(Booking entity);
    }
}
