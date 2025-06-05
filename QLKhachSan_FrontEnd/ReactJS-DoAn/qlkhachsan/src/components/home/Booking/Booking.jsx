import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

function BookingForm({ closeModal }) {
  const navigate = useNavigate();
  const [notifyProps, setNotifyProps] = useState(null);

  const [formData, setFormData] = useState({
    people: 1,
    checkIn: null,
    checkOut: null,
  });

  // Hàm hiện thông báo lỗi và tự ẩn sau 3 giây
  const showNotification = (message) => {
    setNotifyProps(message);
    setTimeout(() => setNotifyProps(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userName = localStorage.getItem('userName');
    if (!userName) {
      navigate('/auth?mode=login');
      return;
    }

    if (!formData.checkIn || !formData.checkOut) {
      showNotification('Vui lòng chọn ngày vào và ngày ra.');
      return;
    }

    const query = new URLSearchParams({
      checkin: formData.checkIn.toISOString(),
      checkout: formData.checkOut.toISOString(),
      people: formData.people,
      user: userName,
    });

    navigate(`/available-rooms?${query.toString()}`);

    // Đóng modal khi submit thành công
    if (closeModal) {
      closeModal();
    }
  };

  return (
    <div className="w-full md:w-[40vw] max-w-full bg-gradient-to-br from-white to-yellow-50 border border-yellow-300 shadow-xl p-6 rounded-3xl h-full flex flex-col">
      <div className="text-center mb-6 select-none">
        <span className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-md">
          Sky Resort
        </span>
        <div className="w-100 mx-auto mt-2 h-[2px] bg-yellow-200 rounded-full"></div>
      </div>

      <h2 className="text-3xl font-extrabold mb-6 text-yellow-600 text-center">Đặt Phòng</h2>

      <form onSubmit={handleSubmit} className="space-y-6 flex-grow overflow-auto">
        {/* Số người */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">👥 Số người</label>
          <input
            type="number"
            name="people"
            value={formData.people}
            min={1}
              className="w-full border-2 border-gray-200 p-3 rounded-xl shadow-sm focus:outline-none  focus:ring-gray-400 hover:border-gray-400 text-gray-800 text-lg"
            onChange={(e) => setFormData({ ...formData, people: Number(e.target.value) })}
            required
          />
        </div>

        {/* Ngày vào và ngày ra */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">🕓 Ngày vào</label>
            <DatePicker
              selected={formData.checkIn}
              onChange={(date) => setFormData({ ...formData, checkIn: date })}
              selectsStart
              startDate={formData.checkIn}
              endDate={formData.checkOut}
              minDate={new Date()}
              placeholderText="Chọn ngày vào"
              className="w-full border-2 border-gray-200 p-3 rounded-xl shadow-sm text-gray-800 text-lg"
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">🕘 Ngày ra</label>
            <DatePicker
              selected={formData.checkOut}
              onChange={(date) => setFormData({ ...formData, checkOut: date })}
              selectsEnd
              startDate={formData.checkIn}
              endDate={formData.checkOut}
              minDate={formData.checkIn || new Date()}
              placeholderText="Chọn ngày ra"
              className="w-full border-2 border-gray-200 p-3 rounded-xl shadow-sm text-gray-800 text-lg"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

        {/* Nút xác nhận */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-[95%] mx-auto bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-2xl text-lg shadow-md transition-transform transform hover:scale-105 block"
          >
            Tìm phòng
          </button>


          {/* Thông báo lỗi hiện ở đây */}
          {notifyProps && (
            <p className="mt-2 text-center text-xl font-bold text-red-700 select-none">
              {notifyProps}
            </p>
          )}

        </div>
      </form>
    </div>
  );
}

export default BookingForm;
