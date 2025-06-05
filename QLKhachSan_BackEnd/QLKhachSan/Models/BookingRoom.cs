using System.ComponentModel.DataAnnotations;

namespace QLKhachSan.Models
{
    public class BookingRoom
    {
        [Key]
        public int Id { get; set; }
        public int RoomCount { get; set; }
        public double ToTalPrice { get; set; }
        public IEnumerable<BookingRoomDetail> BookingRoomDetails { get; set; }
    }
}
