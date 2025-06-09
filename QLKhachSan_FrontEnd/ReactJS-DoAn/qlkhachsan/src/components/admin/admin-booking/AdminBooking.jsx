import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const statusMap = {
  Pending: 'Chờ xác nhận',
  Confirmed: 'Đã xác nhận',
  Ongoing: 'Đang diễn ra',
  Completed: 'Hoàn tất',
  Cancelled: 'Đã hủy',
};

const AdminBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('All');
  const itemsPerPage = 10;
  const storedToken = localStorage.getItem('token');

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://localhost:5001/api/Booking', {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const allBookings = response.data.result || [];
      const nonDraftBookings = allBookings.filter(
        (booking) => booking.bookingStatus !== 'Draft'
      );
      const sortedBookings = nonDraftBookings.sort((a, b) => {
        return new Date(b.updateBookingDate) - new Date(a.updateBookingDate);
      });
      setBookings(sortedBookings);
      console.log(sortedBookings)
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Lỗi khi tải danh sách đặt phòng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Lọc và phân trang
  const filteredByStatus =
    filterStatus === 'All'
      ? bookings
      : bookings.filter((b) => b.bookingStatus === filterStatus);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredByStatus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredByStatus.length / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Danh sách đơn đặt</h1>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {/* Nút lọc trạng thái */}
          <div className="flex justify-end mb-4 space-x-2">
            {['All', 'Pending', 'Confirmed', 'Ongoing', 'Completed', 'Cancelled'].map((status) => (
                <button
                key={status}
                className={`px-3 py-1 rounded outline-none border-none hover:border-none focus:border-none focus:outline-none ${
                    filterStatus === status
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-300 text-black'
                }`}
                onClick={() => {
                    setFilterStatus(status);
                    setCurrentPage(1);
                }}
                >
                {status === 'All' ? 'Tất cả' : statusMap[status]}
                </button>
            ))}
            </div>


          {/* Bảng dữ liệu */}
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-500 text-white">
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Tên khách hàng</th>
                <th className="py-2 px-4 border">Id đơn dịch vụ</th>
                <th className="py-2 px-4 border">Id đơn phòng</th>
                <th className="py-2 px-4 border">Ngày cập nhật</th>
                <th className="py-2 px-4 border">Ngày đặt</th>
                <th className="py-2 px-4 border">Trạng thái</th>
                <th className="py-2 px-4 border">Tổng tiền</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    Không có dữ liệu đặt phòng
                  </td>
                </tr>
              ) : (
                currentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b">
                    <td className="py-2 px-4 text-center">{booking.id}</td>
                    <td className="py-2 px-4">
                      {booking.person?.firstMidName} {booking.person?.lastName}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {booking.bookingServiceId ?? 'Không có'}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {booking.bookingRoomId ?? 'Không có'}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {new Date(booking.updateBookingDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 text-center">
                        <span
                            className={`inline-block w-32 text-center px-3 py-1 rounded-full text-white text-sm font-medium ${
                            {
                                Pending: 'bg-yellow-500',
                                Confirmed: 'bg-blue-500',
                                Ongoing: 'bg-purple-500',
                                Completed: 'bg-green-600',
                                Cancelled: 'bg-red-500',
                            }[booking.bookingStatus] || 'bg-gray-400'
                            }`}
                        >
                            {statusMap[booking.bookingStatus] ?? booking.bookingStatus}
                        </span>
                    </td>
                    <td className="py-2 px-4 text-center">
                        {booking.totalPrice.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                        })}
                    </td>
                    <td className="py-2 px-4 text-center">
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded"
                            onClick={() => {
                                navigate(`/admin/dashboard/booking/${booking.id}`);
                            }}
                        >
                            Cập nhật trạng thái
                        </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="flex justify-end items-center mt-4 space-x-2">
            <button
              className="px-3 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt; Trang trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`px-3 py-1 rounded ${
                  currentPage === pageNum
                    ? 'bg-gray-500 text-white'
                    : 'bg-gray-300 text-black'
                }`}
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button
              className="px-3 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Trang sau &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBooking;
