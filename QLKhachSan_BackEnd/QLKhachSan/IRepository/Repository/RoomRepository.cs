using QLKhachSan.Data;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;

namespace QLKhachSan.Repository
{
    public class RoomRepository : Repository<Room>, IRoomRepository
    {
        private readonly ApplicationDbContext _db;
        public RoomRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<Room> UpdateAsync(Room entity)
        {
            _db.Rooms.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
