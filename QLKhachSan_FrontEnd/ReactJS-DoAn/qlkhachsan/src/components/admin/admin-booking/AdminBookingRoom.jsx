import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEye } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa";

const AdminBookingRoom = () => {
  const [bookingRooms, setBookingRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const storedToken = localStorage.getItem("token");

  const fetchBookingRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://localhost:5001/api/BookingRoom", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setBookingRooms(response.data.result || []);
    } catch (err) {
      setError("Không thể tải dữ liệu đặt phòng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingRooms();
  }, []);

  const filteredBookings = bookingRooms.filter((booking) =>
    booking.id.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Danh sách phòng đã đặt</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <FaSpinner className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[300px] bg-red-50 rounded-lg">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Số lượng phòng</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((booking) => (
                  <tr key={booking.id} className="hover:bg-indigo-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-center">{booking.roomCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-center">
                      {booking.toTalPrice.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleViewDetails(booking.id)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                        title="Xem chi tiết"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Hiển thị{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> đến{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredBookings.length)}
              </span>{" "}
              của <span className="font-medium">{filteredBookings.length}</span> kết quả
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Trang trước
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Trang sau
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBookingRoom;
