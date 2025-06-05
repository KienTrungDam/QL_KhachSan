using QLKhachSan.Data;
using QLKhachSan.Models;
using QLKhachSan.Repository;
using QLKhachSan.Repository.IRepository;

namespace QLKhachSan.Repository
{
    public class ServiceRepository : Repository<Service>, IServiceRepository
    {
        private readonly ApplicationDbContext _db;
        public ServiceRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<Service> UpdateAsync(Service entity)
        {
            _db.Services.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
