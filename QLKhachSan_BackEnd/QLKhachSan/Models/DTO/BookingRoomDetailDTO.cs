using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLKhachSan.Models.DTO
{
    public class BookingRoomDetailDTO
    {
        public int Id { get; set; }
        public int BookingRoomId { get; set; }
        public int RoomId { get; set; }
        public Room Room { get; set; }
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public int? NumberOfGuests { get; set; }
    }
}
