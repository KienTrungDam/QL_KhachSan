using QLKhachSan.Models;

namespace QLKhachSan.Repository.IRepository
{
    public interface IBookingServiceDetailRepository : IRepository<BookingServiceDetail>
    {
        Task<BookingServiceDetail> UpdateAsync(BookingServiceDetail entity);
    }
}
