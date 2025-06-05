using QLKhachSan.Data;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;
using QLKhachSan.Repository;

namespace QLKhachSan.IRepository.Repository
{
    public class PaymentRepository : Repository<Payment>, IPaymentRepository
    {
        private readonly ApplicationDbContext _db;
        public PaymentRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public async Task<Payment> UpdateAsync(Payment entity)
        {
            _db.Payments.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
    }
}
