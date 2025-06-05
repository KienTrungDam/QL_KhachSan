using System.ComponentModel.DataAnnotations.Schema;

namespace QLKhachSan.Models.DTO
{
    public class BookingDTO
    {
        public int Id { get; set; }
        public string PersonId { get; set; }
        public int? BookingServiceId { get; set; }
        public int? BookingRoomId { get; set; }
        public DateTime? BookingDate { get; set; }
        public DateTime UpdateBookingDate { get; set; }
        public double TotalPrice { get; set; }
        public string BookingStatus { get; set; }
        public PersonDTO Person { get; set; }
        public BookingServiceDTO BookingService { get; set; }
        public BookingRoomDTO BookingRoom { get; set; }
    }
}
