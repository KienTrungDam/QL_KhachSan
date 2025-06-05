import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBookingService = () => {
  const [bookingServices, setBookingServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const storedToken = localStorage.getItem("token");

  const fetchBookingServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://localhost:5001/api/BookingService", // API của booking service
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setBookingServices(response.data.result || []);
      console.log(response.data.result || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách dịch vụ đặt phòng:", err);
      setError("Không thể tải dữ liệu dịch vụ đặt phòng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingServices();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bookingServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bookingServices.length / itemsPerPage);

  const handleViewDetails = (id) => {
    console.log("Xem chi tiết dịch vụ booking id:", id);
    // Bạn có thể thêm điều hướng hoặc modal hiển thị chi tiết ở đây
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Danh sách dịch vụ đã đặt</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <table className="min-w-full bg-white mt-4 shadow rounded">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Số lượng</th>
                <th className="py-2 px-4 border-b">Tổng tiền</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((service) => (
                <tr key={service.id}>
                  <td className="py-2 px-4 border-b text-center">{service.id}</td>
                  <td className="py-2 px-4 border-b text-center">{service.serviceCount}</td>
                  <td className="py-2 px-4 border-b text-center">
                    {service.toTalPrice.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => handleViewDetails(service.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              &lt; Trang trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Trang sau &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBookingService;
