import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";

const AdminPayment = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const storedToken = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://localhost:5001/api/Payment/GetAllPayments",
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        const sortedPayments = (response.data.result || []).sort(
          (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
        );
        setPayments(sortedPayments);
      } catch (err) {
        showNotification("Lỗi khi tải danh sách thanh toán: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [storedToken]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const filteredPayments = payments.filter((payment) => {
    const fullName = `${payment.booking?.person?.firstMidName || ""} ${
      payment.booking?.person?.lastName || ""
    }`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <IoMdNotifications className="mr-2" />
          {notification}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Quản lý thanh toán
        </h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <div className="relative flex-1 max-w-xs">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo họ tên..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-700 to-gray-500 text-white">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Khách hàng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Booking ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Phương thức
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Ngày
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-4 text-gray-500"
                      >
                        Không có thanh toán nào
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((payment, index) => (
                      <tr
                        key={payment.id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100 transition-colors`}
                      >
                        <td className="px-6 py-4 text-sm text-center">
                          {payment.id}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {payment.booking?.person?.firstMidName}{" "}
                          {payment.booking?.person?.lastName}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {payment.bookingId}
                        </td>
                        <td className="px-6 py-4 text-sm ">
                          {payment.paymentMethod}
                        </td>
                        <td className="px-6 py-4 text-sm ">
                          {new Date(payment.paymentDate).toLocaleString("vi-vn")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Hiển thị {indexOfFirstItem + 1} đến{" "}
                {Math.min(indexOfLastItem, filteredPayments.length)} trong tổng
                số {filteredPayments.length} thanh toán
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  &lt; Trước
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        currentPage === pageNum
                          ? "bg-gray-500 text-white"
                          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Tiếp &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayment;
