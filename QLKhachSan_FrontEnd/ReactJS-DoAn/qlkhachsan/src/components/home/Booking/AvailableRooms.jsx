import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AvailableRooms() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const checkin = query.get('checkin');
  const checkout = query.get('checkout');
  const people = query.get('people');

  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await axios.get('https://localhost:5001/api/Room/available', {
          params: { checkin, checkout, people }
        });
        const data = response.data.result || [];
        setRooms(data);

        const categoryNames = [...new Set(data.map(r => r.categoryRoom?.name).filter(Boolean))];
        setCategories(categoryNames);
        setActiveCategory(categoryNames[0] || '');
      } catch (error) {
        console.error('Lỗi khi tải phòng khả dụng:', error);
      }
    };

    if (checkin && checkout && people) {
      fetchAvailableRooms();
    }
  }, [checkin, checkout, people]);

  const filteredRooms = rooms.filter(r => r.categoryRoom?.name === activeCategory);
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const paginatedRooms = filteredRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTabClick = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  return (
    <section id="room" className="py-20 bg-white w-4/5 mx-auto">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Phòng khả dụng</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-6 flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`cursor-pointer py-2 px-4 rounded-full transition duration-200 ${
              activeCategory === category ? 'bg-yellow-500 text-white font-semibold' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => handleTabClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Room list */}
      <div className="space-y-8 mt-6">
        {paginatedRooms.map(room => {
          const mainImage = room.roomImages?.find(img => img.isMain);
          const imageUrl = mainImage
            ? `https://localhost:5001/${mainImage.imageUrl.replace(/\\/g, '/')}`
            : 'https://via.placeholder.com/400x200?text=No+Image';

          return (
            <div
              key={room.id}
              onClick={() => navigate(`/room/${room.id}${location.search}`)}
              className="flex flex-col md:flex-row bg-white rounded-2xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition duration-300"
            >
              {/* Image */}
              <div className="md:w-1/2 w-full mb-4 md:mb-0 md:mr-6">
                <img
                  src={imageUrl}
                  alt="Ảnh phòng"
                  className="w-full h-60 object-cover rounded-xl"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex items-center">
                <div className="space-y-2 text-left w-full">
                  <h3 className="text-xl font-bold text-gray-800">Phòng {room.roomNumber}</h3>
                  <p className="text-gray-600 text-sm">🛏️ Loại phòng: <span className="font-medium">{room.categoryRoom?.name || 'Không rõ'}</span></p>
                  <p className="text-gray-600 text-sm">👥 Sức chứa: {room.maxOccupancy} người</p>
                  <p className="text-gray-600 text-sm">📏 Diện tích: {room.roomSize} m²</p>
                  <p className="text-gray-600 text-sm">💰 Giá theo ngày: <span className="text-green-600 font-semibold">{room.priceDay?.toLocaleString()} VND</span></p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 items-center">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className="px-4 py-2 mx-2 text-black rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          {'<'}
        </button>

        <span className="px-4 text-gray-700 font-medium">
          Page {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 mx-2 text-black rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          {'>'}
        </button>
      </div>
    </section>
  );
}

export default AvailableRooms;
