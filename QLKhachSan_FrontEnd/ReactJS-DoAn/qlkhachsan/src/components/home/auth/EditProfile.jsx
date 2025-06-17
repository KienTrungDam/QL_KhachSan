import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import homeimage from "../../../images/home/homeimage.png";

const EditProfile = () => {
  const navigate = useNavigate();
  const [notifyProps, setNotifyProps] = useState(null);

  const [userData, setUserData] = useState({
    id: "",
    lastName: "",
    firstMidName: "",
    address: "",
    cccd: "",
    role: "",
  });

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

  useEffect(() => {
    const storedData = {
      id: localStorage.getItem("userId") || "",
      lastName: localStorage.getItem("lastName") || "",
      firstMidName: localStorage.getItem("firstMidName") || "",
      address: localStorage.getItem("address") || "",
      cccd: localStorage.getItem("cccd") || "",
      role: localStorage.getItem("role") || "",
    };
    setUserData(storedData);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { id, lastName, firstMidName, address, cccd, role } = userData;
    if (!id || !lastName || !firstMidName || !address || !cccd || !role) {
      return showNotification("error", "Vui lòng nhập đầy đủ thông tin");
    }

    try {
      const token = localStorage.getItem("token");

      const updatedUser = {
        id, // 👈 Đảm bảo gửi id vào body
        lastName,
        firstMidName,
        address,
        cccd,
        role,
      };

      await axios.put(
        `https://localhost:5001/api/UserManagement/UpdateUser/${id}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cập nhật localStorage
      Object.entries(updatedUser).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      showNotification("success", "Cập nhật thành công!");
    } catch (error) {
      console.error(error);
      showNotification("error", "Cập nhật thất bại, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
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
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-90 z-0"
        style={{ backgroundImage: `url(${homeimage})` }}
      ></div>

      <div className="relative z-10 w-full max-w-xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Cập nhật tài khoản
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Cập nhật thông tin cá nhân của bạn
        </p>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nhập tên"
              value={userData.lastName}
              onChange={(e) =>
                setUserData({ ...userData, lastName: e.target.value })
              }
            />
          </div>

          {/* Họ tên đệm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên đệm
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nhập họ tên đệm"
              value={userData.firstMidName}
              onChange={(e) =>
                setUserData({ ...userData, firstMidName: e.target.value })
              }
            />
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nhập địa chỉ"
              value={userData.address}
              onChange={(e) =>
                setUserData({ ...userData, address: e.target.value })
              } 
            />
          </div>

          {/* CCCD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CCCD
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nhập CCCD"
              value={userData.cccd}
              onChange={(e) =>
                setUserData({ ...userData, cccd: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition hover:border-none focus:outline-none focus:ring-0"
          >
            Cập nhật
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              className="text-yellow-500 hover:border-none border-0 outline-none focus:outline-none focus:ring-0 focus:border-none"
              onClick={() => navigate(-1)}
            >
              Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
