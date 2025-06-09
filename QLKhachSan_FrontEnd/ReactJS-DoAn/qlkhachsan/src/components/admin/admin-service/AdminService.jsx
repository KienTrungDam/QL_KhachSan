import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import ServiceModal from "../admin-model/ServiceModel";

const AdminService = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [editService, setEditService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifyProps, setNotifyProps] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const storedToken = localStorage.getItem("adminToken");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (actionType === "add") {
      setNewService({ ...newService, [name]: value });
    } else {
      setEditService({ ...editService, [name]: value });
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get("https://localhost:5001/api/Service", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setServices(response.data.result || []);
    } catch (error) {
      showNotification("Lỗi khi tải danh sách dịch vụ: " + error.message);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);
  const handleAddService = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newService.name);
      formData.append("description", newService.description);
      formData.append("price", newService.price);

      await axios.post("https://localhost:5001/api/Service", formData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setNewService({ name: "", description: "", price: "" });
      setShowForm(false);
      fetchServices();
      showNotification("success", "Thêm dịch vụ thành công!");
    } catch (error) {
      console.error("Error adding service:", error);
      showNotification("error", "Thêm dịch vụ thất bại!", error.message);
    }
  };
  const handleUpdateService = async () => {
    try {
      const formData = new FormData();
      formData.append("id", editService.id);
      formData.append("name", editService.name);
      formData.append("description", editService.description);
      formData.append("price", editService.price);

      await axios.put(
        `https://localhost:5001/api/Service/${editService.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setEditService(null);
      setShowForm(false);
      fetchServices();
      showNotification("success", "Cập nhật dịch vụ thành công!");
    } catch (error) {
      console.error("Error updating service:", error);
      showNotification("error", "Cập nhật dịch vụ thất bại!", error.message);
    }
  };

  const handleDeleteService = async () => {
    try {
      await axios.delete(
        `https://localhost:5001/api/Service/${editService.id}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setEditService(null);
      setShowForm(false);
      fetchServices();
      showNotification("success", "Xoá dịch vụ thành công!");
    } catch (error) {
      console.error("Error deleting service:", error);
      showNotification("error", "Xoá dịch vụ thất bại!", error.message);
    }
  };


  const showNotification = (type, message, description = "") => {
    if (notifyProps) return;
    const newNotifyProps = {
      type,
      message,
      description,
      placement: "topRight",
    };
    setNotifyProps(newNotifyProps);
    setTimeout(() => setNotifyProps(null), 3000);
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const indexOfLastService = currentPage * itemsPerPage;
  const indexOfFirstService = indexOfLastService - itemsPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService
  );
  const openModal = (type, service = null) => {
    setActionType(type);
    setEditService(service);
    setShowForm(true);
  };


  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen p-8">
      {notifyProps && (
        <div
          className={`p-4 mb-4 rounded ${
            notifyProps.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
          }}
        >
          <strong>{notifyProps.message}</strong>
          {notifyProps.description && <p>{notifyProps.description}</p>}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Quản lý dịch vụ
        </h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-xs">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm dịch vụ..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={() => openModal("add")}
              >
                Thêm dịch vụ
              </button>
            </div>
            <ServiceModal
              isOpen={showForm}
              onClose={() => {
                setShowForm(false);
                setEditService(null);
                setActionType(null);
              }}
              actionType={actionType}
              editService={editService}
              newService={newService}
              onInputChange={handleInputChange}
              onSave={handleAddService}
              onUpdate={handleUpdateService}
              onDelete={handleDeleteService}
            />

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-700 to-gray-500 text-white">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Tên dịch vụ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Giá
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Mô tả
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentServices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-4 text-gray-500"
                      >
                        Không có dịch vụ nào
                      </td>
                    </tr>
                  ) : (
                    currentServices.map((service, index) => (
                      <tr
                        key={service.id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100 transition-colors`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {service.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {service.price}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {service.description}
                        </td>
                        <td className="px-6 py-4 text-sm flex space-x-2">
                          <button
                            className="text-yellow-500 hover:text-yellow-700 focus:outline-none focus:ring-0 border-none"
                            onClick={() => openModal("update", service)}
                            title="Chỉnh sửa"
                          >
                            <FaEdit size={20} />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-0 border-none"
                            onClick={() => openModal("delete", service)}
                            title="Xóa"
                          >
                            <FaTrash size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Hiển thị {indexOfFirstService + 1} đến{" "}
                {Math.min(indexOfLastService, filteredServices.length)} trong
                tổng số {filteredServices.length} dịch vụ
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default AdminService;
