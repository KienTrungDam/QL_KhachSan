import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";

function DetailRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const location = useLocation();
  const [notifyProps, setNotifyProps] = useState(null);
  const query = new URLSearchParams(location.search);
  const userId = localStorage.getItem("userId");
  const storedToken = localStorage.getItem("token");
  const checkIn = query.get('checkin');
  const checkOut = query.get('checkout');
  const people = query.get('people');

  const showNotification = (type, message, description = "") => {
    if (notifyProps) return;
    const newNotifyProps = { type, message, description, placement: "topRight" };
    setNotifyProps(newNotifyProps);
    setTimeout(() => setNotifyProps(null), 3000);
  };

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`https://localhost:5001/api/Room/${id}`);
        const roomData = response.data.result;
        
        if (roomData?.roomImages?.length) {
          // Đưa ảnh chính lên đầu
          roomData.roomImages.sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
        }
        setImages(roomData.roomImages || []);
        console.log(roomData.roomImages || [])
        setRoom(roomData);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Error fetching room detail:", error);
      }
    };
    fetchRoom();
  }, [id]);

  if (!room) {
    return <div className="text-center mt-10">Đang tải thông tin phòng...</div>;
  }

  const imageUrl = images.length > 0
    ? `https://localhost:5001/${images[currentIndex].imageUrl.replace(/\\/g, "/")}`
    : "https://via.placeholder.com/600x400?text=No+Image";

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  const handleBack = () => navigate(-1);

  const handleBooking = async () => {
    try {
      const payload = {
        RoomId: room.id,
        PersonId: userId,
        CheckInDate: checkIn,
        CheckOutDate: checkOut,
        NumberOfGuests: people,
      };

      const response = await axios.post("https://localhost:5001/api/BookingRoom", payload, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      showNotification("success", "Đặt phòng thành công");
    } catch (error) {
      console.error("Booking error:", error);
      showNotification("error", "Lỗi đặt phòng", error.response?.data?.message || "Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="w-4/5 mx-auto py-10">
      {notifyProps && (
        <div
          className={`fixed top-[90px] right-6 bg-${
            notifyProps.type === "success"
              ? "green"
              : notifyProps.type === "error"
              ? "red"
              : "yellow"
          }-100 border border-${
            notifyProps.type === "success"
              ? "green"
              : notifyProps.type === "error"
              ? "red"
              : "yellow"
          }-400 text-${
            notifyProps.type === "success"
              ? "green"
              : notifyProps.type === "error"
              ? "red"
              : "yellow"
          }-700 px-4 py-3 rounded shadow z-50`}
        >
          <strong className="font-bold">{notifyProps.message}</strong>
          {notifyProps.description && <p>{notifyProps.description}</p>}
        </div>
      )}
      <h2 className="text-2xl font-bold mt-10 mb-6 text-center text-gray-800">
        Thông tin phòng
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Carousel ảnh phòng với style tương tự ví dụ của bạn */}
        <div className="md:w-1/2 relative group">
          <div
            style={{ backgroundImage: `url(${imageUrl})` }}
            className="w-full h-80 rounded-2xl bg-center bg-cover duration-500 relative"
          >
            {/* Nút điều hướng */}
            {images.length > 1 && (
              <>
                <div
                  onClick={prevSlide}
                  className="hidden group-hover:block absolute top-[50%] left-5 -translate-y-1/2 p-2 bg-black/20 text-white rounded-full cursor-pointer"
                >
                  <BsChevronCompactLeft size={30} />
                </div>
                <div
                  onClick={nextSlide}
                  className="hidden group-hover:block absolute top-[50%] right-5 -translate-y-1/2 p-2 bg-black/20 text-white rounded-full cursor-pointer"
                >
                  <BsChevronCompactRight size={30} />
                </div>
              </>
            )}
          </div>

          {/* Dấu chấm */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-3">
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
        </div>

        {/* Thông tin phòng */}
        <div className="md:w-1/2 space-y-4">
          <p>
            <strong>Loại phòng:</strong> {room.categoryRoom?.name || "Không rõ"}
          </p>
          <p>
            <strong>Số lượng người tối đa:</strong> {room.maxOccupancy}
          </p>
          <p>
            <strong>Kích cỡ phòng:</strong> {room.roomSize} m²
          </p>
          <p>
            <strong>Giá theo ngày: {room.priceDay?.toLocaleString()}$</strong>
          </p>
          <p>
            <strong>Giá theo tuần: {room.priceWeek?.toLocaleString()}$</strong>
          </p>

          <p>
            <strong>Mô tả:</strong> {room.description}
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg w-full md:w-auto hover:bg-gray-600"
            >
              Quay lại
            </button>

            {people && (
              <button
                onClick={handleBooking}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 w-full md:w-auto"
              >
                Đặt phòng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailRoom;
