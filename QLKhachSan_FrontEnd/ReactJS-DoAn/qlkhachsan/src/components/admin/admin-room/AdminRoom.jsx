import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHotel, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { MdDashboard, MdPeople, MdSettings } from "react-icons/md";
import RoomModal from "../admin-model/RoomModel";
import { FaSearch } from "react-icons/fa";
import RoomDetailModal from "../admin-model/RoomDetailModel";
const AdminRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    CategoryRoomId: "",
    Status: "",
    MaxOccupancy: "",
    RoomNumber: "",
    RoomSize: "",
    PriceDay: "",
    PriceWeek: "",
    Description: "",
    MainImage: null,
    Images: [],
  });
  const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);
  const [showRoomDetail, setShowRoomDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [editRoom, setEditRoom] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [notifyProps, setNotifyProps] = useState(null);
  const storedToken = localStorage.getItem("adminToken");

  const showNotification = (type, message, description = "") => {
    if (notifyProps) return;
    setNotifyProps({ type, message, description });
    setTimeout(() => setNotifyProps(null), 3000);
  };
  const handleViewRoomDetail = (room) => {
    setSelectedRoomDetail(room);
    setShowRoomDetail(true);
  };
  const fetchRooms = async () => {
    try {
      const response = await axios.get("https://localhost:5001/api/Room", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setRooms(response.data.result || []);
      console.log(response.data.result || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };
  const filteredRooms = rooms.filter((room) => {
    const roomNumberMatch = room.roomNumber
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const categoryMatch = room.categoryRoom?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const categoryFilterMatch =
      selectedCategoryId === "" ||
      room.categoryRoomId?.toString() === selectedCategoryId;

    return (roomNumberMatch || categoryMatch) && categoryFilterMatch;
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://localhost:5001/api/CategoryRoom",
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setCategories(response.data.result || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (actionType === "add") {
      setNewRoom({ ...newRoom, [name]: value });
    } else {
      setEditRoom({ ...editRoom, [name]: value });
    }
  };

  const handleAddRoom = async () => {
    try {
      const formData = new FormData();
      Object.entries(newRoom).forEach(([key, value]) => {
        if (key === "Images")
          value.forEach((file) => formData.append("Images", file));
        else if (key === "MainImage" && value)
          formData.append("MainImage", value);
        else formData.append(key, value);
      });

      await axios.post("https://localhost:5001/api/Room", formData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setShowForm(false);
      fetchRooms();
      showNotification("success", "Thêm phòng thành công!");
    } catch (error) {
      console.error("Error adding room:", error);
      showNotification("error", "Thêm phòng thất bại!", error.message);
    }
  };

  const handleUpdateRoom = async () => {
    try {
      const formData = new FormData();
      formData.append("id", editRoom.id);
      formData.append("CategoryRoomId", editRoom.categoryRoomId);
      formData.append("Status", editRoom.status);
      formData.append("MaxOccupancy", editRoom.maxOccupancy);
      formData.append("PriceDay", editRoom.priceDay);
      formData.append("PriceWeek", editRoom.priceWeek);
      if (editRoom.newMainImage)
        formData.append("MainImage", editRoom.newMainImage);
      if (editRoom.newImages)
        editRoom.newImages.forEach((file) => formData.append("Images", file));

      await axios.put(
        `https://localhost:5001/api/Room/${editRoom.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowForm(false);
      fetchRooms();
      showNotification("success", "Cập nhật phòng thành công!");
    } catch (error) {
      console.error("Error updating room:", error);
      showNotification("error", "Cập nhật phòng thất bại!", error.message);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await axios.delete(`https://localhost:5001/api/Room/${editRoom.id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setShowForm(false);
      fetchRooms();
      showNotification("success", "Xoá phòng thành công!");
    } catch (error) {
      console.error("Error deleting room:", error);
      showNotification("error", "Xoá phòng thất bại!", error.message);
    }
  };

  const openModal = (type, room = null) => {
    setActionType(type);
    setEditRoom(room);
    setShowForm(true);
  };

  useEffect(() => {
    fetchRooms();
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen flex">
      <main className="flex-1 p-6 bg-gray-100">
        {notifyProps && (
          <div
            className={`fixed top-4 right-4 p-4 rounded shadow-lg z-50 ${
              notifyProps.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <strong>{notifyProps.message}</strong>
            {notifyProps.description && <p>{notifyProps.description}</p>}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Danh sách phòng</h2>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => openModal("add")}
          >
            <FaPlus className="inline mr-2" /> Thêm phòng
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm phòng..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Select */}
          <select
            className="w-full sm:w-64 px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
            }}
          >
            <option value="">Tất cả loại phòng</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredRooms.map((room) => {
            const mainImage = room.roomImages?.find((img) => img.isMain);
            const imageUrl = mainImage
              ? `https://localhost:5001/${mainImage.imageUrl.replace(
                  /\\/g,
                  "/"
                )}`
              : null;
            return (
              <div
                key={room.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg"
              >
                <img
                  src={imageUrl || "https://via.placeholder.com/150"}
                  alt="Room"
                  className="w-full h-40 object-cover rounded mb-4 cursor-pointer hover:opacity-80 transition"
                  onClick={() => handleViewRoomDetail(room)}
                />
                <h3 className="text-lg font-bold">Phòng {room.roomNumber}</h3>
                <p className="text-sm text-gray-500">
                  Loại: {room.categoryRoom.name}
                </p>
                <p className="text-sm">Giá: ${room.priceDay}/đêm</p>
                <p className="text-sm">Sức chứa: {room.maxOccupancy} người</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="text-yellow-500 hover:text-yellow-600"
                    onClick={() => openModal("update", room)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => openModal("delete", room)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <RoomModal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditRoom(null);
            setActionType(null);
          }}
          actionType={actionType}
          editRoom={editRoom}
          newRoom={newRoom}
          onInputChange={handleInputChange}
          onSave={handleAddRoom}
          onUpdate={handleUpdateRoom}
          onDelete={handleDeleteRoom}
          categories={categories}
        />
        <RoomDetailModal
          isOpen={showRoomDetail}
          onClose={() => setShowRoomDetail(false)}
          room={selectedRoomDetail}
        />
      </main>
    </div>
  );
};

export default AdminRoom;
