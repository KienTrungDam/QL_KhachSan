import React, { useEffect, useState } from "react";
import axios from "axios";

function Service() {
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const storedToken = localStorage.getItem("token");
  const [quantities, setQuantities] = useState({});
  const [hoveredId, setHoveredId] = useState(null); // id item đang hover
  const [notifyProps, setNotifyProps] = useState(null);
  const showNotification = (type, message, description = "") => {
      if (notifyProps) return;
      const newNotifyProps = { type, message, description, placement: "topRight" };
      setNotifyProps(newNotifyProps);
      setTimeout(() => setNotifyProps(null), 3000);
  };
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("https://localhost:5001/api/Service");
        setServices(response.data.result || []);
        // console.log("a", response.data.result)
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const paginatedServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleQuantityChange = (serviceId, value) => {
    if (value < 1) value = 1;
    setQuantities((prev) => ({
      ...prev,
      [serviceId]: value,
    }));
  };


const handleOrderService = async (service) => {
  const quantity = quantities[service.id] || 1;
  try {
    const response = await axios.post(
      "https://localhost:5001/api/BookingService",
      null,
      {
        params: { serviceId: service.id, quanlity: quantity },
        headers: { Authorization: `Bearer ${storedToken}` },
      }
    );

    showNotification("success", "Đặt dịch vụ thành công");
  } catch (error) {
    console.error("Lỗi đặt dịch vụ:", error);
    showNotification("error", "Lỗi đặt dịch vụ", "Vui lòng thử lại sau.");
  }
};


  return (
    <section id="service" className="py-20 bg-gray-50 w-4/5 mx-auto">
      {notifyProps && (
        <div className={`fixed top-[90px] right-6 bg-${notifyProps.type === "success" ? "green" : notifyProps.type === "error" ? "red" : "yellow"}-100 border border-${notifyProps.type === "success" ? "green" : notifyProps.type === "error" ? "red" : "yellow"}-400 text-${notifyProps.type === "success" ? "green" : notifyProps.type === "error" ? "red" : "yellow"}-700 px-4 py-3 rounded shadow z-50`}>
          <strong className="font-bold">{notifyProps.message}</strong>
          {notifyProps.description && <p>{notifyProps.description}</p>}
        </div>
      )}
      <h2 className="text-5xl font-semibold font-serif text-center text-yellow-500 mb-12 tracking-wide leading-tight drop-shadow-sm">
        Danh sách dịch vụ
      </h2>
      <div className="space-y-6">
        {paginatedServices.map((service) => (
          <div
            key={service.id}
            className="bg-white p-6 rounded-2xl shadow border border-gray-200 hover:shadow-md transition duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            onMouseEnter={() => setHoveredId(service.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div>
              <h3 className="text-xl font-bold text-yellow-600 mb-2">
                {service.name}
              </h3>
              <p className="text-gray-700 mb-1">
                <strong>Mô tả:</strong> {service.description || "Không có mô tả"}
              </p>
              <p className="text-gray-700">
                <strong>Giá:</strong>{" "}
                <span className="text-green-600 font-semibold">
                  {service.price?.toLocaleString()}$
                </span>{" "}
                / {service.unit || "lượt"}
              </p>
            </div>

            {/* Chỉ hiển thị khi hover đúng item */}
            {hoveredId === service.id && (
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  value={quantities[service.id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(service.id, parseInt(e.target.value) || 1)
                  }
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  onClick={() => handleOrderService(service)}
                  className="px-5 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                >
                  Đặt dịch vụ
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 mx-2 text-black rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          {"<"}
        </button>

        <span className="px-4 text-gray-700 font-medium">
          Page {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 mx-2 text-black rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
      </div>
    </section>
  );
}

export default Service;
