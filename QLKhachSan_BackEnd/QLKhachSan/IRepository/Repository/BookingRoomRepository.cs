using QLKhachSan.Data;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;
using QLKhachSan.Repository;

namespace QLKhachSan.IRepository.Repository
{
    public class BookingRoomRepository : Repository<BookingRoom>, IBookingRoomRepository
    {
        private readonly ApplicationDbContext _db;
        public BookingRoomRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<BookingRoom> UpdateAsync(BookingRoom entity)
        {
            _db.BookingRooms.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
