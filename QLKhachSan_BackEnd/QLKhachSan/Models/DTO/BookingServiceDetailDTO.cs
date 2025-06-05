using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace QLKhachSan.Models.DTO
{
    public class BookingServiceDetailDTO
    {
        public int Id { get; set; }
        public int BookingServiceId { get; set; }
        public int ServiceId { get; set; }
        [Required]
        public int Quantity { get; set; }
        public ServiceDTO Service { get; set; }
    }
}
