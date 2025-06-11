import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminBookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        const res = await axios.get(`https://localhost:5001/api/Booking/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooking(res.data.result);
        console.log(res.data.result);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết đơn đặt:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetail();
  }, [bookingId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'xác nhận':
        return 'bg-green-100 text-green-700';
      case 'pending':
      case 'chờ xử lý':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
      case 'đã hủy':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Đang tải chi tiết đơn...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Không tìm thấy đơn đặt</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Trở về</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Đơn đặt #{booking.id}</h1>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(booking.bookingStatus)}`}>
              {booking.bookingStatus}
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {booking.totalPrice.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Khách hàng:</span>
            <p className="font-medium">{booking.person?.firstMidName} {booking.person?.lastName}</p>
          </div>
          <div>
            <span className="text-gray-500">Ngày đặt:</span>
            <p className="font-medium">{new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</p>
          </div>
          <div>
            <span className="text-gray-500">Cập nhật:</span>
            <p className="font-medium">{new Date(booking.updateBookingDate).toLocaleDateString("vi-VN")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rooms */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Phòng đã đặt</h2>
          
          {booking.bookingRoomId === null ? (
            <p className="text-gray-500 text-center py-4">Không có phòng</p>
          ) : (
            <div className="space-y-3">
              {booking.bookingRoom.bookingRoomDetails.map((room, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Phòng:</span>
                      <p className="font-medium">{room.room.roomNumber || "Không rõ"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Số khách:</span>
                      <p className="font-medium">{room.numberOfGuests} người</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Check-in:</span>
                      <p className="font-medium">{new Date(room.checkInDate).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Check-out:</span>
                      <p className="font-medium">{new Date(room.checkOutDate).toLocaleDateString("vi-VN")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Services */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Dịch vụ đã đặt</h2>
          
          {booking.bookingServiceId === null ? (
            <p className="text-gray-500 text-center py-4">Không có dịch vụ</p>
          ) : (
            <div className="space-y-3">
              {booking.bookingService.bookingServiceDetails.map((service, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{service.service?.name || "Không rõ"}</p>
                      <p className="text-sm text-gray-500">Dịch vụ</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">x{service.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetail;