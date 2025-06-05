using QLKhachSan.Data;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;
using QLKhachSan.Repository;

namespace QLKhachSan.IRepository.Repository
{
    public class BookingRoomDetailRepository : Repository<BookingRoomDetail>, IBookingRoomDetailRepository
    {
        private readonly ApplicationDbContext _db;
        public BookingRoomDetailRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<BookingRoomDetail> UpdateAsync(BookingRoomDetail entity)
        {
            _db.BookingRoomDetails.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
