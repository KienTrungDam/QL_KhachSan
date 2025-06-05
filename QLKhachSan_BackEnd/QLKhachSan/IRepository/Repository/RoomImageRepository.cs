using QLKhachSan.Data;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;

namespace QLKhachSan.Repository
{
    public class RoomImageRepository : Repository<RoomImage>, IRoomImageRepository
    {
        private readonly ApplicationDbContext _db;
        public RoomImageRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<RoomImage> UpdateAsync(RoomImage entity)
        {
            _db.RoomImages.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
