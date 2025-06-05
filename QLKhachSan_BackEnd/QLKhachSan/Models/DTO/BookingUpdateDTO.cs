namespace QLKhachSan.Models.DTO
{
    public class BookingUpdateDTO
    {
        public int Id { get; set; }
        public int? RoomId { get; set; }
        public string PersonId { get; set; }
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public int? NumberOfGuests { get; set; }
    }
}
