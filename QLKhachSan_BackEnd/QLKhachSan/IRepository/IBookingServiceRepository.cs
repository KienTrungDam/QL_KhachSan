using QLKhachSan.Models;

namespace QLKhachSan.Repository.IRepository
{
    public interface IBookingServiceRepository : IRepository<BookingService>
    {
        Task<BookingService> UpdateAsync(BookingService entity);
    }
}
