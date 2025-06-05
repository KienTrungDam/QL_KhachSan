namespace QLKhachSan.Models.DTO
{
    public class NewUpdateDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public IFormFile? Image { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string Author { get; set; }
    }
}
