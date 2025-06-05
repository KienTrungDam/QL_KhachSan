using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace QLKhachSan.Models
{
    public class Person : IdentityUser
    {
        [Required]
        [StringLength(50)]
        public string LastName { get; set; }
        [Required]
        [StringLength(50, ErrorMessage = "First name cannot be longer than 50 characters.")]
        public string FirstMidName { get; set; }
        public string Address { get; set; }
        //public DateTime DateOfBirth { get; set; }
        public string CCCD { get; set; }
        [NotMapped]
        public string Role { get; set; }
        [NotMapped]
        public string? FullName
        {
            get
            {
                return LastName + ", " + FirstMidName;
            }
        }
    }
}
