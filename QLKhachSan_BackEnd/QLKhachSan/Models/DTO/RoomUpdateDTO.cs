using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLKhachSan.Models.DTO
{
    public class RoomUpdateDTO
    {
        public int Id { get; set; }
        [Required]
        public int CategoryRoomId { get; set; }
        public string Status { get; set; }
        public string RoomNumber { get; set; }
        public int MaxOccupancy { get; set; }
        public double RoomSize { get; set; }
        public double PriceDay { get; set; }
        public double PriceWeek { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public IFormFile? MainImage { get; set; }
        public List<IFormFile>? Images { get; set; }
    }
}
