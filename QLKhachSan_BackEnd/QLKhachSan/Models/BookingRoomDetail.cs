using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace QLKhachSan.Models
{
    public class BookingRoomDetail
    {
        public int Id { get; set; }
        [ForeignKey("BookingRoomId")]
        public int BookingRoomId { get; set; }
        [ValidateNever]
        public BookingRoom BookingRoom { get; set; }
        [ForeignKey("RoomId")]
        public int RoomId { get; set; }
        public Room Room { get; set; }
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public int? NumberOfGuests { get; set; }
    }
}
