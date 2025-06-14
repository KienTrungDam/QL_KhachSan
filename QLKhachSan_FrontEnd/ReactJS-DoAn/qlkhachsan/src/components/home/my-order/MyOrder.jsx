import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyOrder = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("Draft");
  const storedToken = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const userId = localStorage.getItem("userID");
  const isStaff = userRole === "Admin" || userRole === "Employee";
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
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

  const fetchBookings = async () => {

    setLoading(true);
    try {
      const response = await axios.get("https://localhost:5001/api/Booking", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setBookings(response.data.result);
    } catch (err) {
      console.error(err);
      setError("Lỗi khi tải dữ liệu đặt phòng hoặc thông tin liên quan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleChangeServiceQuantity = async (detailId, delta) => {
    const endpoint = delta === 1 ? "PlusService" : "MinusService";

    try {
      const url = `https://localhost:5001/api/BookingService/${endpoint}?userId=${userId}&bookingServiceDetailId=${detailId}`;
      console.log("🔗 URL gửi yêu cầu:", url);

      await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      fetchBookings();
    } catch (error) {
      console.error(`Lỗi khi gọi API ${endpoint}:`, error);
      alert("Cập nhật số lượng dịch vụ thất bại.");
    }
  };

  const handleCheckout = async (bookingId) => {
    try {
      const response = await axios.post(
        `https://localhost:5001/api/Payment/MakePayment/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      console.log(response.data.result);
      window.location.href = response.data.result.url;
    } catch (error) {
      console.error("Lỗi khi tạo phiên thanh toán:", error);
      alert("Thanh toán thất bại.");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const storedToken = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `https://localhost:5001/api/Payment/RefundPayment/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      fetchBookings();
      showNotification("success", "Hủy đơn thành công");
    } catch (error) {
      console.error("Lỗi khi hủy đơn:", error);
      alert("Có lỗi xảy ra khi hủy đơn.");
    }
  };

  const handleRemoveRoom = async (bookingRoomDetailId) => {
    try {
      const response = await axios.delete(
        `https://localhost:5001/api/BookingRoom?userId=${userId}&bookingRoomDetailId=${bookingRoomDetailId}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      fetchBookings();
      showNotification("success", "Xóa phòng thành công");
    } catch (error) {
      console.error("Lỗi khi xoá phòng:", error);
      showNotification("error", "Lỗi xóa đặt phòng", "Vui lòng thử lại sau.");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600 font-medium">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="pt-5 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Notification */}
      {notifyProps && (
        <div
          className={`fixed top-6 right-6 z-50 transform transition-all duration-300 ease-in-out animate-pulse`}
        >
          <div
            className={`
            px-6 py-4 rounded-xl shadow-lg border-l-4 backdrop-blur-sm
            ${
              notifyProps.type === "success"
                ? "bg-green-50 border-green-500 text-green-800"
                : notifyProps.type === "error"
                ? "bg-red-50 border-red-500 text-red-800"
                : "bg-yellow-50 border-yellow-500 text-yellow-800"
            }
          `}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${
                  notifyProps.type === "success"
                    ? "bg-green-100"
                    : notifyProps.type === "error"
                    ? "bg-red-100"
                    : "bg-yellow-100"
                }
              `}
              >
                {notifyProps.type === "success"
                  ? "✓"
                  : notifyProps.type === "error"
                  ? "✕"
                  : "!"}
              </div>
              <div>
                <p className="font-semibold">{notifyProps.message}</p>
                {notifyProps.description && (
                  <p className="text-sm opacity-90">
                    {notifyProps.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="pt-5 text-5xl font-bold leading-normal bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {isStaff ? "Quản lý đơn đặt phòng" : "Đơn đặt của bạn"}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isStaff
              ? "Theo dõi và quản lý tất cả các đơn đặt phòng trong hệ thống"
              : "Quản lý và theo dõi các đơn đặt phòng của bạn"}
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl text-gray-400">📋</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Chưa có đơn đặt nào
            </h3>
            <p className="text-gray-500">
              Hãy bắt đầu đặt phòng để xem thông tin tại đây
            </p>
          </div>
        ) : isStaff ? (
          // Enhanced Staff Table
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                Danh sách đơn đặt phòng
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Mã đơn
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phòng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Dịch vụ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">
                              #{booking.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.person?.firstMidName}{" "}
                          {booking.person?.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {booking.bookingRoomId || "Chưa đặt"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {booking.bookingServiceId || "Không có"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`
                          inline-flex px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            booking.bookingStatus === "Cancel"
                              ? "bg-red-100 text-red-800"
                              : booking.bookingStatus === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.bookingStatus === "Ongoing"
                              ? "bg-blue-100 text-blue-800"
                              : booking.bookingStatus === "Completed"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        `}
                        >
                          {booking.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            {/* Enhanced Confirmation Modal */}
            {showConfirmModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-10 max-w-lg w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-4xl font-bold shadow-lg">
                      ?
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Xác nhận hủy đơn
                  </h3>
                  <p className="text-center text-gray-600 text-lg mb-8 leading-relaxed">
                    Bạn có chắc chắn muốn{" "}
                    <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                      hủy đơn đặt phòng
                    </span>{" "}
                    này không?
                  </p>

                  <div className="flex justify-center space-x-6">
                    <button
                      className="px-8 py-3 bg-gray-100 rounded-xl text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      onClick={() => setShowConfirmModal(false)}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      onClick={() => {
                        handleCancelBooking(cancelBookingId);
                        setShowConfirmModal(false);
                      }}
                    >
                      Xác nhận hủy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Controls */}
            <div className="flex flex-col lg:flex-row items-center gap-6 mb-8">
              <button
                className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold text-gray-700 shadow-md hover:shadow-lg transform hover:scale-105"
                onClick={handleBack}
              >
                ← Trở lại
              </button>

              <div className="flex flex-wrap justify-center gap-3 flex-1">
                {[
                  {
                    key: "Draft",
                    label: "Chưa xác nhận",
                    color: "from-gray-400 to-gray-500",
                  },
                  {
                    key: "Pending",
                    label: "Chờ xác nhận",
                    color: "from-yellow-400 to-orange-500",
                  },
                  {
                    key: "Confirmed",
                    label: "Đã xác nhận",
                    color: "from-green-400 to-green-500",
                  },
                  {
                    key: "Ongoing",
                    label: "Đang diễn ra",
                    color: "from-blue-400 to-blue-500",
                  },
                  {
                    key: "Completed",
                    label: "Hoàn tất",
                    color: "from-purple-400 to-purple-500",
                  },
                  {
                    key: "Cancelled",
                    label: "Đã huỷ",
                    color: "from-red-400 to-red-500",
                  },
                ].map((status) => (
                  <button
                    key={status.key}
                    onClick={() => setActiveStatus(status.key)}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg ${
                      activeStatus === status.key
                        ? `bg-gradient-to-r ${status.color} text-white shadow-lg`
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Booking Cards */}
            <div className="space-y-8">
              {bookings.filter((b) => b.bookingStatus === activeStatus)
                .length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl text-gray-400">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Không có đơn nào
                  </h3>
                  <p className="text-gray-500">
                    Chưa có đơn đặt nào trong trạng thái này.
                  </p>
                </div>
              ) : (
                bookings
                  .filter((b) => b.bookingStatus === activeStatus)
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden"
                    >
                      {/* Background Gradient */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-purple-50 rounded-full transform translate-x-32 -translate-y-32 opacity-50"></div>

                      {/* Header */}
                      <div className="relative z-10 flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Đơn đặt #{booking.id}
                          </h3>
                          <p className="text-gray-500">
                            Ngày tạo: {new Date().toLocaleDateString()}
                          </p>
                        </div>

                        {/* Status Badge */}
                        {booking.bookingStatus === "Cancelled" ? (
                          <span className="bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                            Đã hoàn tiền
                          </span>
                        ) : booking.bookingStatus !== "Draft" ? (
                          <span className="bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                            Đã thanh toán
                          </span>
                        ) : null}
                      </div>

                      {/* Rooms Section */}
                      <div className="relative z-10 space-y-6 mb-8">
                        {booking.bookingRoom?.bookingRoomDetails?.length > 0 ? (
                          booking.bookingRoom.bookingRoomDetails.map(
                            (detail, index) => {
                              const mainImage = detail.room?.roomImages?.find(
                                (img) => img.isMain
                              );
                              const imageUrl = mainImage
                                ? `https://localhost:5001/${mainImage.imageUrl.replace(
                                    /\\/g,
                                    "/"
                                  )}`
                                : "https://via.placeholder.com/600x300?text=No+Image";

                              return (
                                <div
                                  key={index}
                                  className="relative flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-md border border-gray-200"
                                >
                                  {/* Remove Button */}
                                  {booking.bookingStatus === "Draft" && (
                                    <button
                                      className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full hover:from-red-500 hover:to-red-600 flex items-center justify-center z-20 shadow-lg transform hover:scale-110 transition-all duration-200"
                                      onClick={() =>
                                        handleRemoveRoom(detail.id)
                                      }
                                      title="Xóa phòng"
                                    >
                                      ×
                                    </button>
                                  )}

                                  {/* Room Image - Made shorter */}
                                  <div className="lg:w-1/2 w-full">
                                    <img
                                      src={imageUrl}
                                      alt="Room"
                                      className="w-full h-40 lg:h-48 object-cover"
                                    />
                                  </div>

                                  {/* Room Info */}
                                  <div className="lg:w-1/2 w-full p-6 flex flex-col justify-center">
                                    <div className="space-y-3 text-gray-700">
                                      <div className="flex items-center space-x-3">
                                        <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                                          {detail.room?.roomNumber}
                                        </span>
                                        <span className="font-semibold text-lg">
                                          Phòng {detail.room?.roomNumber}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <span className="text-sm text-gray-500">
                                            Kích thước
                                          </span>
                                          <p className="font-semibold">
                                            {detail.room?.roomSize} m²
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-500">
                                            Số người
                                          </span>
                                          <p className="font-semibold">
                                            {detail.numberOfGuests} người
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-500">
                                            Nhận phòng
                                          </span>
                                          <p className="font-semibold">
                                            {new Date(
                                              detail.checkInDate
                                            ).toLocaleDateString("vi-VN")}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-500">
                                            Trả phòng
                                          </span>
                                          <p className="font-semibold">
                                            {new Date(
                                              detail.checkOutDate
                                            ).toLocaleDateString("vi-VN")}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )
                        ) : (
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 text-yellow-700 p-6 rounded-2xl text-center font-semibold shadow-md">
                            <span className="text-2xl mb-2 block">🏨</span>
                            Hiện tại chưa đặt phòng
                          </div>
                        )}
                      </div>

                      {/* Services Section */}
                      <div className="relative z-10 mb-8">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                          <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                            🛎️
                          </span>
                          Dịch vụ đi kèm
                        </h4>
                        {booking.bookingService?.bookingServiceDetails?.length >
                        0 ? (
                          <div className="grid gap-3">
                            {booking.bookingService.bookingServiceDetails.map(
                              (detail, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl px-6 py-4 border border-purple-100 shadow-sm"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                      <span className="text-purple-600">
                                        ⭐
                                      </span>
                                    </div>
                                    <span className="text-lg font-semibold text-gray-800">
                                      {detail.service?.name || "Dịch vụ"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    {booking.bookingStatus === "Draft" ? (
                                      <div className="flex items-center space-x-2">
                                        <button
                                          className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full hover:from-red-500 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
                                          onClick={() =>
                                            handleChangeServiceQuantity(
                                              detail.id,
                                              -1
                                            )
                                          }
                                        >
                                          -
                                        </button>
                                        <span className="w-12 text-center font-bold text-lg bg-white rounded-lg py-2 shadow-sm">
                                          {detail.quantity}
                                        </span>
                                        <button
                                          className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
                                          onClick={() =>
                                            handleChangeServiceQuantity(
                                              detail.id,
                                              1
                                            )
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="font-bold text-lg bg-white rounded-lg px-4 py-2 shadow-sm">
                                        {detail.quantity}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-xl">
                            <span className="text-3xl mb-2 block">🚫</span>
                            Không có dịch vụ đi kèm
                          </div>
                        )}
                      </div>

                      {/* Total & Actions */}
                      <div className="relative z-10 border-t-2 border-gray-100 pt-6">
                        <div className="text-right mb-4">
                          <p className="text-sm text-gray-500 mb-1">
                            Tổng thanh toán
                          </p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {booking.totalPrice?.toLocaleString() || "0"}$
                          </p>
                        </div>

                        <div className="flex justify-end gap-3">
                          {booking.bookingStatus === "Draft" && (
                            <button
                              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                              onClick={() => handleCheckout(booking.id)}
                            >
                              💳 Thanh toán ngay
                            </button>
                          )}

                          {booking.bookingStatus === "Pending" && (
                            <button
                              className="px-8 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                              onClick={() => {
                                setCancelBookingId(booking.id);
                                setShowConfirmModal(true);
                              }}
                            >
                              ❌ Hủy đơn
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
