import React, { useEffect, useState } from "react";
import axios from "axios";
import ServiceModal from "../admin-model/ServiceModel";
import { FaEdit, FaTrash } from "react-icons/fa";

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
  const [notifyProps, setNotifyProps] = useState(null);
  const storedToken = localStorage.getItem("adminToken");

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

  const fetchServices = async () => {
    try {
      const response = await axios.get("https://localhost:5001/api/Service", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setServices(response.data.result || []);
      //   console.log("s", response.data.result);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (actionType === "add") {
      setNewService({ ...newService, [name]: value });
    } else {
      setEditService({ ...editService, [name]: value });
    }
  };

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

  const openModal = (type, service = null) => {
    setActionType(type);
    setEditService(service);
    setShowForm(true);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
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

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh sách dịch vụ</h1>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => openModal("add")}
        >
          Add Service
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

      <table className="min-w-full bg-white mt-4">
        <thead className="bg-gray-500 text-white">
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td className="py-2 px-4 border-b text-center">{service.id}</td>
              <td className="py-2 px-4 border-b">{service.name}</td>
              <td className="py-2 px-4 border-b text-center">
                {service.price}
              </td>
              <td className="py-2 px-4 border-b">{service.description}</td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  className="mr-2 text-yellow-500 hover:text-yellow-700 focus:outline-none focus:ring-0 border-none"
                  onClick={() => openModal("update", service)}
                  title="Chỉnh sửa"
                >
                  <FaEdit size={25} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-0 border-none"
                  onClick={() => openModal("delete", service)}
                  title="Xoá"
                >
                  <FaTrash size={25} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminService;
