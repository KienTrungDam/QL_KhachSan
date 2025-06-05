using System.ComponentModel.DataAnnotations;

namespace QLKhachSan.Models.DTO
{
    public class ServiceUpdateDTO
    {
        [Required]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
    }
}
