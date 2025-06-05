namespace QLKhachSan.Models.DTO
{
    public class BookingServiceDTO
    {
        public int Id { get; set; }
        public int ServiceCount { get; set; }
        public double ToTalPrice { get; set; }
        public ICollection<BookingServiceDetailDTO> BookingServiceDetails { get; set; }
    }
}
