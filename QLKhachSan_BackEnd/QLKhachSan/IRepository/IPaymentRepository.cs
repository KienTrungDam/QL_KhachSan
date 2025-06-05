using QLKhachSan.Models;

namespace QLKhachSan.Repository.IRepository
{
    public interface IPaymentRepository : IRepository<Payment>
    {
        Task<Payment> UpdateAsync(Payment entity);
    }
}
