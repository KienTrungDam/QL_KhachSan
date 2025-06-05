using System.ComponentModel.DataAnnotations.Schema;

namespace QLKhachSan.Models.DTO
{
    public class PaymentDTO
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public string? PaymentStatus { get; set; }
        public double TotalPrice { get; set; }
        public string? StripePaymentIntentID { get; set; }
        public string? PaymentMethod { get; set; }
        public string? PaymentDate { get; set; }
    }
}
