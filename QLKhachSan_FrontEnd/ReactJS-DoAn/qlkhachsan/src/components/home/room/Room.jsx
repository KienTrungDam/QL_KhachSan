import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Room() {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("https://localhost:5001/api/Room");
        const data = response.data.result || [];
        setRooms(data);

        const categoryNames = [
          ...new Set(data.map((r) => r.categoryRoom?.name).filter(Boolean)),
        ];
        setCategories(categoryNames);
        setActiveCategory(categoryNames[0] || "");
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(
    (r) => r.categoryRoom?.name === activeCategory
  );
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTabClick = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  return (
    <section id="room" className="py-24 bg-gradient-to-br via-white to-amber-50 min-h-screen">
      <div className="w-4/5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-600 mb-4 tracking-wide leading-tight">
            Danh sách phòng
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto rounded-full"></div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12 flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`cursor-pointer py-3 px-8 rounded-full transition-all duration-200 font-semibold text-base shadow-sm ${
                activeCategory === category
                  ? "bg-yellow-500 text-white shadow-yellow-200"
                  : "bg-white text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 hover:shadow-md border border-gray-200"
              }`}
              onClick={() => handleTabClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Room list */}
        <div className="space-y-6 mt-8">
          {paginatedRooms.map((room, index) => {
            const mainImage = room.roomImages?.find((img) => img.isMain);
            const imageUrl = mainImage
              ? `https://localhost:5001/${mainImage.imageUrl.replace(/\\/g, "/")}`
              : "https://via.placeholder.com/400x200?text=No+Image";

            return (
              <div
                key={room.id}
                onClick={() => navigate(`/room/${room.id}`)}
                className={`group cursor-pointer bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-yellow-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${
                  index % 2 === 0 ? 'animate-fade-in-left' : 'animate-fade-in-right'
                }`}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image */}
                  <div className="lg:w-2/5 w-full relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Ảnh phòng"
                      className="w-full h-48 lg:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      Phòng {room.roomNumber}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-6 flex items-center">
                    <div className="space-y-4 text-left w-full">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-yellow-600 transition-colors duration-300">
                        {room.categoryRoom?.name || "Phòng tiêu chuẩn"}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">👥</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Sức chứa</p>
                            <p className="text-sm font-bold text-gray-800">{room.maxOccupancy} người</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">📏</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Diện tích</p>
                            <p className="text-sm font-bold text-gray-800">{room.roomSize} m²</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-gray-700 text-lg font-semibold">
                          💰 Giá:{" "}
                          <span className="text-yellow-600 text-xl font-bold">
                            {room.priceDay?.toLocaleString()}$/ ngày
                          </span>
                        </p>
                      </div>

                      <div className="pt-2">
                        <button className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white py-3 px-6 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:from-yellow-600 hover:to-amber-600">
                          Xem chi tiết phòng →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-16 items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="w-12 h-12 flex items-center justify-center text-gray-600 rounded-full bg-white hover:bg-yellow-50 hover:text-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-gray-200 transition-all duration-300 transform hover:scale-110"
            disabled={currentPage === 1}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-12 h-12 flex items-center justify-center rounded-full font-semibold transition-all duration-300 transform hover:scale-110 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-200"
                    : "bg-white text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 shadow-md border border-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="w-12 h-12 flex items-center justify-center text-gray-600 rounded-full bg-white hover:bg-yellow-50 hover:text-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-gray-200 transition-all duration-300 transform hover:scale-110"
            disabled={currentPage === totalPages}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}

export default Room;