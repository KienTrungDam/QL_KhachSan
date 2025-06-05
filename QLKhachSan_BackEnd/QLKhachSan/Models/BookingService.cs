using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLKhachSan.Models
{
    public class BookingService
    {
        [Key]
        public int Id { get; set; }
        public int ServiceCount { get; set; }
        public double ToTalPrice { get; set; }
        public IEnumerable<BookingServiceDetail> BookingServiceDetails { get; set; }
    }
}
