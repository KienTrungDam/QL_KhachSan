using QLKhachSan.Data;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;

namespace QLKhachSan.Repository
{
    public class CategoryRoomRepository : Repository<CategoryRoom>, ICategoryRoomRepository
    {
        private readonly ApplicationDbContext _db;
        public CategoryRoomRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<CategoryRoom> UpdateAsync(CategoryRoom entity)
        {
            _db.CategoryRooms.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
