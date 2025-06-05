using QLKhachSan.Data;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;
using QLKhachSan.Repository;

namespace QLKhachSan.IRepository.Repository
{
    public class BookingServiceDetailRepository : Repository<BookingServiceDetail>, IBookingServiceDetailRepository
    {
        private readonly ApplicationDbContext _db;
        public BookingServiceDetailRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<BookingServiceDetail> UpdateAsync(BookingServiceDetail entity)
        {
            _db.BookingServiceDetails.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
