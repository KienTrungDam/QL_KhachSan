using System.ComponentModel.DataAnnotations.Schema;

namespace QLKhachSan.Models.DTO
{
    public class BookingCreateDTO
    {
        public int RoomId { get; set; }
        public string PersonId { get; set; }
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
    }
}
