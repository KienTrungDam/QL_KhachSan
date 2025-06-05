using System.ComponentModel.DataAnnotations;

namespace QLKhachSan.Models.DTO
{
    public class CategoryRoomUpdateDTO
    {
        [Required]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
