using QLKhachSan.Data;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;
using QLKhachSan.Repository;

namespace QLKhachSan.IRepository.Repository
{
    public class BookingServiceRepository : Repository<BookingService>, IBookingServiceRepository
    {
        private readonly ApplicationDbContext _db;
        public BookingServiceRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<BookingService> UpdateAsync(BookingService entity)
        {
            _db.BookingServices.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
