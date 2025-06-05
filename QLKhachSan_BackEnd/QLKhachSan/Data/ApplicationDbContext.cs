using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using QLKhachSan.Models;

namespace QLKhachSan.Data
{
    public class ApplicationDbContext : IdentityDbContext<Person>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)

        {
        }
        public DbSet<Person> Persons { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingService> BookingServices { get; set; }
        public DbSet<CategoryRoom> CategoryRooms { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomImage> RoomImages { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<BookingServiceDetail> BookingServiceDetails { get; set; }
        public DbSet<BookingRoomDetail> BookingRoomDetails { get; set; }
        public DbSet<BookingRoom> BookingRooms { get; set; }
        public DbSet<New> News { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<CategoryRoom>().HasData(
                
                new CategoryRoom { Id = 1, Name = "Phòng đơn", Description = "Phòng đơn"},
                new CategoryRoom { Id = 2, Name = "Phòng đôi", Description = "Phòng đơn"},
                new CategoryRoom { Id = 3, Name = "Phòng Vip", Description = "Phòng đơn"},
                new CategoryRoom { Id = 4, Name = "Phòng SupperVip", Description = "Phòng đơn"}
                );
            //modelBuilder.Entity<Resort>().HasData(
            //    new Resort { Id = 1, Name = "Resort 1", Address = "123", PhoneNumber = "123", Rate = 5 },
            //    new Resort { Id = 2, Name = "Resort 2", Address = "123", PhoneNumber = "123", Rate = 4 },
            //    new Resort { Id = 3, Name = "Resort 3", Address = "123", PhoneNumber = "123", Rate = 2 },
            //    new Resort { Id = 4, Name = "Resort 4", Address = "123", PhoneNumber = "123", Rate = 1 }
            //    );
            //modelBuilder.Entity<Room>().HasData(
            //    new Room { Id = 1, CategoryRoomId = 1, Status = "Trống", PriceDay = 100, PriceWeek = 500, Floor = 1, Description = "View: biển, núi, có cửa sổ ngắm biển"},
            //    new Room { Id = 2, CategoryRoomId = 2, Status = "Đã thuê", PriceDay = 100, PriceWeek = 500, Floor = 3, Description = "View: biển, núi, có cửa sổ ngắm biển" },
            //    new Room { Id = 3, CategoryRoomId = 2, Status = "Đã thuê", PriceDay = 100, PriceWeek = 500, Floor = 2, Description = "View: biển, núi, có cửa sổ ngắm biển" },
            //    new Room { Id = 4, CategoryRoomId = 3, Status = "Trống", PriceDay = 100, PriceWeek = 500, Floor = 9, Description = "View: biển, núi, có cửa sổ ngắm biển" }
            //    );
                
                
        }
    }
}
