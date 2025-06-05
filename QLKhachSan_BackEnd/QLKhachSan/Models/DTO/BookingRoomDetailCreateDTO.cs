namespace QLKhachSan.Models.DTO
{
    public class BookingRoomDetailUpSertDTO
    {
        public int RoomId { get; set; }
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public int? NumberOfGuests { get; set; }
    }
}
