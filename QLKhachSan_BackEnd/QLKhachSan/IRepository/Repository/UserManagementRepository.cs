

using QLKhachSan.Data;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;

namespace QLKhachSan.Repository
{
    public class UserManagementRepository : Repository<Person>, IUserManagementRepository
    {
        private readonly ApplicationDbContext _db;
        public UserManagementRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<Person> UpdateAsync(Person applicationUser)
        {
            _db.Persons.Update(applicationUser);
            await _db.SaveChangesAsync();
            return applicationUser;
        }
    }
}
