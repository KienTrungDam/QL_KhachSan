using System.ComponentModel.DataAnnotations;

namespace QLKhachSan.Models.DTO
{
    public class NewDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string Author { get; set; }
    }
}
