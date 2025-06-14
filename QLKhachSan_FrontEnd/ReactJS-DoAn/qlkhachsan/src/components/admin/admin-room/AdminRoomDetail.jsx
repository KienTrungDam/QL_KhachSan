// src/components/admin/AdminRoomDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";

const AdminRoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const storedToken = localStorage.getItem("token");
  const [bookedDates, setBookedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(
          `https://localhost:5001/api/Room/${roomId}`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        const roomData = res.data.result;

        if (roomData?.roomImages?.length) {
          roomData.roomImages.sort(
            (a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0)
          );
        }

        setRoom(roomData);
        setCurrentIndex(0);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết phòng:", err);
      }
    };

    const fetchBookedDates = async () => {
      try {
        const res = await axios.get(
          `https://localhost:5001/api/Room/ListBookingDate/${roomId}`
        );
        if (res.data.isSuccess && res.data.result) {
          setBookedDates(res.data.result);
        }
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    };

    fetchRoom();
    fetchBookedDates();
  }, [roomId]);

  const isDateBooked = (date) => {
    return bookedDates.some((booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const currentDate = new Date(date);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      return currentDate >= checkIn && currentDate < checkOut;
    });
  };

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  if (!room) return <p className="p-4">Đang tải dữ liệu...</p>;

  const images = room.roomImages || [];
  const imageUrl =
    images.length > 0
      ? `https://localhost:5001/${images[currentIndex].imageUrl.replace(
          /\\/g,
          "/"
        )}`
      : "https://via.placeholder.com/600x400?text=No+Image";

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => setCurrentIndex(index);

  const calendarDays = generateCalendar();
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-100 hover:shadow-md hover:border-transparent transition duration-200"
      >
        <BsChevronCompactLeft className="text-xl" />
        <span>Quay lại</span>
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Chi tiết phòng {room.roomNumber}
      </h2>

      {/* Ảnh và lịch */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Bên trái: ảnh + thông tin */}
        <div className="lg:w-3/5 w-full flex flex-col h-full">
          {/* Ảnh */}
          <div
            className="relative group w-full h-64 rounded-2xl bg-center bg-cover mb-4"
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            {images.length > 1 && (
              <>
                <div
                  onClick={prevSlide}
                  className="hidden group-hover:block absolute top-[50%] left-4 -translate-y-1/2 p-2 bg-black/20 text-white rounded-full cursor-pointer"
                >
                  <BsChevronCompactLeft size={30} />
                </div>
                <div
                  onClick={nextSlide}
                  className="hidden group-hover:block absolute top-[50%] right-4 -translate-y-1/2 p-2 bg-black/20 text-white rounded-full cursor-pointer"
                >
                  <BsChevronCompactRight size={30} />
                </div>
              </>
            )}
          </div>

          {/* Dấu chấm ảnh */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mb-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`text-2xl cursor-pointer ${
                    index === currentIndex ? "text-blue-600" : "text-gray-300"
                  }`}
                >
                  <RxDotFilled />
                </button>
              ))}
            </div>
          )}

          {/* Thông tin phòng */}
          <div className="bg-white p-4 rounded shadow flex-1">
            <p>
              <strong>Loại phòng:</strong> {room.categoryRoom?.name}
            </p>
            <p>
              <strong>Sức chứa:</strong> {room.maxOccupancy} người
            </p>
            <p>
              <strong>Giá ngày:</strong> ${room.priceDay?.toLocaleString()}
            </p>
            <p>
              <strong>Giá tuần:</strong> ${room.priceWeek?.toLocaleString()}
            </p>
            <p>
              <strong>Diện tích:</strong> {room.roomSize} m²
            </p>
            <p>
              <strong>Trạng thái:</strong> {room.status}
            </p>
            <p>
              <strong>Ngày cập nhật:</strong>{" "}
              {new Date(room.updatedAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Bên phải: lịch */}
        <div className="lg:w-2/5 w-full bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-4 text-lg">Lịch đặt phòng</h3>

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <BsChevronCompactLeft size={20} />
            </button>
            <h4 className="font-medium text-lg">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <BsChevronCompactRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-2 text-center font-medium text-gray-600 text-sm"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isBooked = isDateBooked(day);
              const isToday = new Date().toDateString() === day.toDateString();

              return (
                <div
                  key={index}
                  className={`p-2 text-center text-sm h-10 flex items-center justify-center
                    ${!isCurrentMonth ? "text-gray-300" : "text-gray-700"}
                    ${
                      isBooked
                        ? "bg-green-500 text-white font-bold"
                        : "hover:bg-gray-100"
                    }
                    ${isToday ? "border-2 border-blue-500" : ""}`}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Đã được đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
              <span>Hôm nay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mô tả */}
      <div className="bg-white p-4 rounded shadow mt-6">
        <h3 className="font-semibold mb-2 text-lg">Mô tả</h3>
        <p>{room.description || "Không có mô tả"}</p>
      </div>
    </div>
  );
};

export default AdminRoomDetail;
