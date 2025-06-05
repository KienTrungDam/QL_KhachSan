import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const storedToken = localStorage.getItem('adminToken');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:5001/api/Payment/GetAllPayments', {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setPayments(response.data.result || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách thanh toán:', err);
      setError('Không thể tải dữ liệu thanh toán.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = payments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Danh sách thanh toán</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <table className="min-w-full bg-white mt-4">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Tên khách hàng</th>
                <th className="py-2 px-4 border-b">Booking ID</th>
                <th className="py-2 px-4 border-b">Phương thức thanh toán</th>
                <th className="py-2 px-4 border-b">Ngày thanh toán</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="py-2 px-4 border-b text-center">{payment.id}</td>
                  <td className="py-2 px-4 border-b">
                    {payment.booking?.person?.firstMidName} {payment.booking?.person?.lastName}
                  </td>
                  <td className="py-2 px-4 border-b text-center">{payment.bookingId}</td>
                  <td className="py-2 px-4 border-b text-center">{payment.paymentMethod}</td>
                  <td className="py-2 px-4 border-b text-center">
                    {new Date(payment.paymentDate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
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
                  currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

export default AdminPayment;
