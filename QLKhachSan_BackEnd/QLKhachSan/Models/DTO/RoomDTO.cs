using System.ComponentModel.DataAnnotations.Schema;

namespace QLKhachSan.Models.DTO
{
    public class RoomDTO
    {
        public int Id { get; set; }
        public int CategoryRoomId { get; set; }
        public string Status { get; set; }
        public string RoomNumber { get; set; }
        public int MaxOccupancy { get; set; }
        public double RoomSize { get; set; }
        public double PriceDay { get; set; }
        public double PriceWeek { get; set; }
        public string Description { get; set; }
        public CategoryRoomDTO CategoryRoom { get; set; }
        public ICollection<RoomImageDTO> RoomImages { get; set; }
    }
}
