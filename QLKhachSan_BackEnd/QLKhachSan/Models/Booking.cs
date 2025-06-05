using QLKhachSan.Utility;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLKhachSan.Models
{
    public class Booking
    {
        public int Id { get; set; }
        [ForeignKey("PersonId")]
        public string PersonId { get; set; }
        public Person Person { get; set; }
        [ForeignKey("BookingServiceId")]
        public int? BookingServiceId { get; set; }
        public BookingService BookingService { get; set; }
        [ForeignKey("BookingRoomId")]
        public int? BookingRoomId { get; set; }
        public BookingRoom BookingRoom { get; set; }
        public DateTime? BookingDate { get; set; }
        public DateTime UpdateBookingDate { get; set; }
        public double TotalPrice { get; set; } = 1;
        public string BookingStatus { get; set; } = SD.Status_Booking_Draft;
    }
}
