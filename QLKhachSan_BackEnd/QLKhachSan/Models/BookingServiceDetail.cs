using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLKhachSan.Models
{
    public class BookingServiceDetail
    {
        public int Id { get; set; }
        [ForeignKey("BookingServiceId")]
        public int BookingServiceId { get; set; }
        [ValidateNever]
        public BookingService BookingService { get; set; }
        [ForeignKey("ServiceId")]
        public int ServiceId { get; set; }
        public Service Service { get; set; }
        [Required]
        public int Quantity { get; set; }
    }
}
