using AutoMapper;
using QLKhachSan.Models;
using QLKhachSan.Models.DTO;

namespace QLKhachSan
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            CreateMap<Person, PersonDTO>().ReverseMap();
            CreateMap<PersonDTO, Person>().ReverseMap();

            CreateMap<Service, ServiceDTO>().ReverseMap();
            CreateMap<Service, ServiceCreateDTO>().ReverseMap();
            CreateMap<Service, ServiceUpdateDTO>().ReverseMap();
            CreateMap<RoomImage, RoomImageDTO>();
            CreateMap<Room, RoomDTO>().ReverseMap();
            //.ForMember(dest => dest.CategoryRoomId, opt => opt.MapFrom(src => src.CategoryRoom.Name));
            CreateMap<Room, RoomCreateDTO>().ReverseMap();
            CreateMap<Room, RoomUpdateDTO>().ReverseMap();

            //CreateMap<Resort, ResortDTO>().ReverseMap();
            //CreateMap<Resort, ResortCreateDTO>().ReverseMap();
            //CreateMap<Resort, ResortUpdateDTO>().ReverseMap();

            CreateMap<CategoryRoom, CategoryRoomDTO>().ReverseMap();
            CreateMap<CategoryRoom, CategoryRoomCreateDTO>().ReverseMap();
            CreateMap<CategoryRoom, CategoryRoomUpdateDTO>().ReverseMap();

            CreateMap<Booking, BookingDTO>().ReverseMap();
            CreateMap<Booking, BookingCreateDTO>().ReverseMap();
            CreateMap<Booking, BookingUpdateDTO>().ReverseMap();

            CreateMap<BookingService, BookingServiceUpdateDTO>().ReverseMap();
            CreateMap<BookingService, BookingServiceCreateDTO>().ReverseMap();
            CreateMap<BookingService, BookingServiceDTO>().ReverseMap();

            CreateMap<BookingServiceDetail, BookingServiceDetailDTO>().ReverseMap();

            CreateMap<BookingRoom, BookingRoomUpdateDTO>().ReverseMap();
            CreateMap<BookingRoom, BookingRoomCreateDTO>().ReverseMap();
            CreateMap<BookingRoom, BookingRoomDTO>().ReverseMap();

            CreateMap<BookingRoomDetail, BookingRoomDetailDTO>().ReverseMap();

            CreateMap<New, NewUpdateDTO>().ReverseMap();
            CreateMap<New, NewCreateDTO>().ReverseMap();
            CreateMap<New, NewDTO>().ReverseMap();
        }
    }
}
