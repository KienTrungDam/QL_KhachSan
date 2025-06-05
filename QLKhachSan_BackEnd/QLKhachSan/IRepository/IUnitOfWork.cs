using QLKhachSan.IRepository;
using QLKhachSan.Repository.IRepository;

namespace QLKhachSan.Repository.IRepository
{
    public interface IUnitOfWork
    {
        IUserRepository User { get; }
        ICategoryRoomRepository CategoryRoom { get; }
        IRoomRepository Room { get; }
        IUserManagementRepository UserManagement { get; }
        IServiceRepository Service { get; }
        IRoomImageRepository RoomImage { get; }
        IBookingRepository Booking { get; }
        IBookingServiceDetailRepository BookingServiceDetail { get; }
        IBookingServiceRepository BookingService { get; }
        IPaymentRepository Payment { get; }
        IBookingRoomRepository BookingRoom { get; }
        IBookingRoomDetailRepository BookingRoomDetail { get; }
        INewRepository New { get; }

        Task SaveAsync();
    }
}
