using QLKhachSan.Data;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;
using QLKhachSan.Repository;

namespace QLKhachSan.IRepository.Repository
{
    public class NewRepository : Repository<New>, INewRepository
    {
        private readonly ApplicationDbContext _db;
        public NewRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<New> UpdateAsync(New entity)
        {
            _db.News.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
