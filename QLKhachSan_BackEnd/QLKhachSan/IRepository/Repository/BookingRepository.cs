using QLKhachSan.Data;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;

namespace QLKhachSan.Repository
{
    public class BookingRepository : Repository<Booking>, IBookingRepository
    {
        private readonly ApplicationDbContext _db;
        public BookingRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<Booking> UpdateAsync(Booking entity)
        {
            _db.Bookings.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
