namespace QLKhachSan.Models.DTO
{
    public class NewCreateDTO
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public IFormFile? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string Author { get; set; }
    }
}
