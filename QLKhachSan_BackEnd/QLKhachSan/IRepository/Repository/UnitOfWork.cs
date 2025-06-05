using AutoMapper;
using Microsoft.AspNetCore.Identity;
using QLKhachSan.Data;
using QLKhachSan.IRepository;
using QLKhachSan.IRepository.Repository;
using QLKhachSan.Models;
using QLKhachSan.Repository.IRepository;

namespace QLKhachSan.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<Person> _userManager;
        private readonly IConfiguration _configuration;
        public IUserRepository User { get; }

        public ICategoryRoomRepository CategoryRoom { get; }

        public IRoomRepository Room { get; }

        public IUserManagementRepository UserManagement { get; }
        public IRoomImageRepository RoomImage { get; }

        public IServiceRepository Service { get; }
        public IBookingRepository Booking { get; }
        public IBookingServiceDetailRepository BookingServiceDetail { get; }
        public IBookingServiceRepository BookingService { get; }
        public IPaymentRepository Payment { get; }
        public IBookingRoomDetailRepository BookingRoomDetail { get; set; }
        public IBookingRoomRepository BookingRoom { get; set; }
        public INewRepository New { get; set; }

        public UnitOfWork(ApplicationDbContext db, RoleManager<IdentityRole> roleManager, UserManager<Person> userManager, IConfiguration configuration, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
            _roleManager = roleManager;
            _userManager = userManager;
            _configuration = configuration;

            New = new NewRepository(_db);
            BookingRoom = new BookingRoomRepository(_db);
            BookingRoomDetail = new BookingRoomDetailRepository(_db);
            BookingService = new BookingServiceRepository(_db);
            BookingServiceDetail = new BookingServiceDetailRepository(_db);
            Payment = new PaymentRepository(_db);
            Booking = new BookingRepository(_db);
            RoomImage = new RoomImageRepository(_db);
            User = new UserRepository(_db, _userManager, _roleManager, _mapper, _configuration);
            Service = new ServiceRepository(_db);
            Room = new RoomRepository(_db);
            CategoryRoom = new CategoryRoomRepository(_db);
            UserManagement = new UserManagementRepository(_db);

        }

        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}
