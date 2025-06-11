import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AdminBookingUpdateStatus = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("token");
  const [notifyProps, setNotifyProps] = useState(null);
  const showNotification = (type, message, description = "") => {
    if (notifyProps) return;
    const newNotifyProps = {
      type,
      message,
      description,
      placement: "topRight",
    };
    setNotifyProps(newNotifyProps);
    setTimeout(() => setNotifyProps(null), 3000);
  };
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(
          `https://localhost:5001/api/Booking/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        setBooking(res.data.result);
      } catch (error) {
        console.error("Lỗi tải chi tiết booking:", error);
        setError("Không tải được chi tiết đơn đặt phòng.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, storedToken]);
  const geStatus = (status) => {
    switch (status) {
      case "Pending":
        return "Chờ xác nhận";
      case "Confirmed":
        return "Đã xác nhận";
      case "Ongoing":
        return "Đang diễn ra";
      case "Completed":
        return "Hoàn thành";
      case "Cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };
  const updateBookingStatus = async (newStatus) => {
    try {
      const response = await axios.put(
        `https://localhost:5001/api/Booking/UpdateStatus?bookingId=${booking.id}&nextStatus=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (response.data.isSuccess) {
        setBooking(response.data.result);
        showNotification(
          "success",
          `Cập nhật trạng thái sang "${newStatus}" thành công.`
        );

        // Nếu là huỷ thì gọi Refund
        if (newStatus === "Cancelled") {
          try {
            const refundResponse = await axios.post(
              `https://localhost:5001/api/Payment/RefundPayment/${bookingId}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                },
              }
            );
            showNotification(
              "success",
              "Hủy đơn thành công",
              "Đã hoàn tiền cho khách."
            );
          } catch (error) {
            console.error("Lỗi khi hủy đơn:", error);
            showNotification(
              "error",
              "Lỗi khi hủy đơn",
              "Có lỗi xảy ra khi hoàn tiền."
            );
          }
        }
      } else {
        const errorMsg =
          response.data.errorMessages?.[0] || "Lỗi không xác định";
        showNotification("error", "Cập nhật thất bại", errorMsg);
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      showNotification(
        "error",
        "Lỗi hệ thống",
        "Không thể cập nhật trạng thái."
      );
    }
  };

  if (loading) return <div>Đang tải chi tiết đơn đặt ...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!booking) return <div>Không tìm thấy đơn đặt </div>;

  return (
    <div className="space-y-6">
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
      {booking.bookingRoom?.bookingRoomDetails?.length === 0 &&
      booking.bookingService?.bookingServiceDetails?.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          Không có đơn nào trong trạng thái này.
        </p>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow relative">
          <div className="absolute top-4 left-4">
            <button
              type="button"
              className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg transition text-base shadow"
              onClick={() => navigate(-1)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Trở về</span>
            </button>
          </div>

          <div className="w-full flex justify-center mb-4">
            <span
              className={`
                min-w-[200px] text-center
                text-white font-bold px-6 py-2 rounded-full
                ${
                  booking.bookingStatus === "Pending"
                    ? "bg-yellow-500"
                    : booking.bookingStatus === "Confirmed"
                    ? "bg-blue-500"
                    : booking.bookingStatus === "Ongoing"
                    ? "bg-purple-500"
                    : booking.bookingStatus === "Completed"
                    ? "bg-green-600"
                    : booking.bookingStatus === "Cancelled"
                    ? "bg-red-500"
                    : "bg-gray-400"
                }
            `}
            >
              {geStatus(booking.bookingStatus)}
            </span>
          </div>

          <div className="mb-4 font-semibold text-gray-700 text-lg">
            Mã đơn: #{booking.id}
          </div>
          {booking.bookingStatus === "Cancelled" ? (
            <span className="absolute top-6 right-6 text-sm text-red-700 font-semibold bg-red-100 px-3 py-1 rounded-full z-10">
              Đã hoàn tiền
            </span>
          ) : (
            <span className="absolute top-6 right-6 text-sm text-green-700 font-semibold bg-green-100 px-3 py-1 rounded-full z-10">
              Đã thanh toán
            </span>
          )}

          {/* Danh sách phòng */}
          <div className="space-y-6">
            {booking.bookingRoom?.bookingRoomDetails?.length > 0 ? (
              booking.bookingRoom.bookingRoomDetails.map((detail, index) => {
                const mainImage = detail.room?.roomImages?.find(
                  (img) => img.isMain
                );
                const imageUrl = mainImage
                  ? `https://localhost:5001/${mainImage.imageUrl.replace(
                      /\\/g,
                      "/"
                    )}`
                  : "https://via.placeholder.com/600x400?text=No+Image";

                return (
                  <div
                    key={index}
                    className="relative flex flex-col md:flex-row gap-6 bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-200"
                  >
                    {/* Hình ảnh phòng */}
                    <div className="md:w-1/2 w-full">
                      <img
                        src={imageUrl}
                        alt="Room"
                        className="w-full h-60 object-cover"
                      />
                    </div>

                    {/* Thông tin phòng */}
                    <div className="md:w-1/2 w-full p-6 flex flex-col justify-between">
                      <div className="space-y-2 text-gray-700">
                        <div>
                          <span className="font-semibold">Số phòng:</span>{" "}
                          {detail.room?.roomNumber}
                        </div>
                        <div>
                          <span className="font-semibold">Kích thước:</span>{" "}
                          {detail.room?.roomSize} m²
                        </div>
                        <div>
                          <span className="font-semibold">Nhận phòng:</span>{" "}
                          {new Date(detail.checkInDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-semibold">Trả phòng:</span>{" "}
                          {new Date(detail.checkOutDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-semibold">Số người:</span>{" "}
                          {detail.numberOfGuests}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full">
                <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 p-4 rounded-lg mb-4 text-center font-semibold">
                  Không đặt phòng
                </div>
              </div>
            )}
          </div>

          {/* Dịch vụ */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">
              Dịch vụ đi kèm:
            </h4>
            {booking.bookingService?.bookingServiceDetails?.length > 0 ? (
              <ul className="space-y-3">
                {booking.bookingService.bookingServiceDetails.map(
                  (detail, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2"
                    >
                      <div className="text-base font-medium text-gray-800">
                        {detail.service?.name || "Dịch vụ"}
                      </div>
                      <div>
                        <span className="font-semibold">{detail.quantity}</span>
                      </div>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Không có dịch vụ</p>
            )}
          </div>

          {/* Tổng tiền */}
          <div className="text-right font-semibold text-2xl text-blue-600 my-6">
            Tổng tiền: {booking.totalPrice?.toLocaleString() || "0"}$
          </div>
          {booking.bookingStatus === "Pending" && (
            <div className="flex gap-4 justify-end mt-6">
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition w-48 border-none hover:border-none"
                onClick={() => updateBookingStatus("Confirmed")}
              >
                Xác nhận
              </button>
              <button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md transition w-48 border-none hover:border-none"
                onClick={() => updateBookingStatus("Cancelled")}
              >
                Hủy đơn
              </button>
            </div>
          )}

          {booking.bookingStatus === "Confirmed" && (
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-md transition w-48 border-none hover:border-none"
                onClick={() => updateBookingStatus("Ongoing")}
              >
                Đang ở
              </button>
            </div>
          )}

          {booking.bookingStatus === "Ongoing" && (
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md transition w-48 border-none hover:border-none"
                onClick={() => updateBookingStatus("Completed")}
              >
                Hoàn thành
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBookingUpdateStatus;
