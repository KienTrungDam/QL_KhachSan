import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const statusMap = {
  Pending: "Chờ xác nhận",
  Confirmed: "Đã xác nhận",
  Ongoing: "Đang diễn ra",
  Completed: "Hoàn tất",
  Cancelled: "Đã hủy",
};

const AdminBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const itemsPerPage = 10;
  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://localhost:5001/api/Booking", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        const all = response.data.result || [];
        const filtered = all.filter((b) => b.bookingStatus !== "Draft");
        const sorted = filtered.sort(
          (a, b) => new Date(b.updateBookingDate) - new Date(a.updateBookingDate)
        );
        setBookings(sorted);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Lỗi khi tải danh sách đặt phòng.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [storedToken]);

  const filteredBookings =
    filterStatus === "All"
      ? bookings
      : bookings.filter((b) => b.bookingStatus === filterStatus);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản lý đơn đặt phòng</h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="items-center flex justify-end mb-6">
              <div className="flex space-x-2">
                {["All", "Pending", "Confirmed", "Ongoing", "Completed", "Cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(status);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded text-sm font-medium ${
                        filterStatus === status
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {status === "All" ? "Tất cả" : statusMap[status]}
                    </button>
                  )
                )}
              </div>
            </div>

            {loading && <p className="text-gray-600">Đang tải dữ liệu...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-700 to-gray-500 text-white">
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Khách hàng</th>
                        {/* <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Cập nhật</th> */}
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Ngày đặt</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Trạng thái</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Tổng tiền</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4 text-gray-500">
                            Không có đơn đặt phòng nào
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((booking, idx) => (
                          <tr
                            key={booking.id}
                            className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                          >
                            <td className="px-6 py-4 text-sm">{booking.id}</td>
                            <td className="px-6 py-4 text-sm">
                              {booking.person?.firstMidName} {booking.person?.lastName}
                            </td>
                            {/* <td className="px-6 py-4 text-sm">
                              {new Date(booking.updateBookingDate).toLocaleDateString("vi-Vn")}
                            </td> */}
                            <td className="px-6 py-4 text-sm">
                              {new Date(booking.bookingDate).toLocaleDateString("vi-Vn")}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span
                        className={`inline-block w-32 text-center px-3 py-1 rounded-full text-white text-sm font-medium ${
                          {
                            Pending: "bg-yellow-500",
                            Confirmed: "bg-blue-500",
                            Ongoing: "bg-purple-500",
                            Completed: "bg-green-600",
                            Cancelled: "bg-red-500",
                          }[booking.bookingStatus] || "bg-gray-400"
                        }`}
                      >
                        {statusMap[booking.bookingStatus] ??
                          booking.bookingStatus}
                      </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800">
                              {booking.totalPrice.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                            </td>
                            <td className="px-6 py-4 text-sm flex space-x-2">
                              <button
                                className="px-3 py-1 bg-green-500 text-white rounded"
                                onClick={() =>
                                  navigate(`/admin/dashboard/booking/${booking.id}`)
                                }
                              >
                                Cập nhật trạng thái
                              </button>
                              <button
                                className="px-3 py-1 bg-blue-500 text-white rounded"
                                onClick={() =>
                                  navigate(`/admin/dashboard/booking-detail/${booking.id}`)
                                }
                              >
                                Xem chi tiết
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Hiển thị {indexOfFirst + 1} đến{" "}
                    {Math.min(indexOfLast, filteredBookings.length)} trong tổng số{" "}
                    {filteredBookings.length} đơn đặt
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      &lt; Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          currentPage === page
                            ? "bg-gray-500 text-white"
                            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Tiếp &gt;
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBooking;
