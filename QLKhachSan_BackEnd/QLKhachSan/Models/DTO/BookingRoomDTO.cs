namespace QLKhachSan.Models.DTO
{
    public class BookingRoomDTO
    {
        public int Id { get; set; }
        public int RoomCount { get; set; }
        public double ToTalPrice { get; set; }
        public ICollection<BookingRoomDetailDTO> BookingRoomDetails { get; set; }
    }
}
