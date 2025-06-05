using System.ComponentModel.DataAnnotations.Schema;

namespace QLKhachSan.Models
{
    public class Payment
    {
        public int Id { get; set; }
        [ForeignKey("BookingId")]
        public int BookingId { get; set; }
        public Booking Booking { get; set; }
        public string? PaymentStatus { get; set; }
        public double TotalPrice { get; set; }
        public string? StripePaymentIntentID { get; set; }
        public string? PaymentMethod { get; set; }
        public DateTime? PaymentDate { get; set; }
    }
}
