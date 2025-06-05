using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QLKhachSan.Models
{
    public class Room
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [ForeignKey("CategoryRoomId")]
        public int CategoryRoomId { get; set; }
        public CategoryRoom CategoryRoom { get; set; }
        public string RoomNumber { get; set; }
        public string Status { get; set; }
        public int MaxOccupancy { get; set; }
        public double RoomSize { get; set; }
        public double PriceDay { get; set; }
        public double PriceWeek { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public IEnumerable<RoomImage> RoomImages { get; set; }

    }
}
