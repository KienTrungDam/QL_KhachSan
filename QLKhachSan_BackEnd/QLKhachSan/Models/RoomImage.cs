using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace QLKhachSan.Models
{
    public class RoomImage
    {
        public int Id { get; set; }
        [Required]
        public string ImageUrl { get; set; }
        public int RoomId { get; set; }
        [ForeignKey("RoomId")]
        [JsonIgnore]
        public Room Room { get; set; }
        public bool IsMain { get; set; } 
    }
}
