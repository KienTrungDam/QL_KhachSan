import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";
import UserCustomerModel from "../admin-model/UserCustomerModel";

const AdminUserCustomer = () => {
  const [newUser, setNewUser] = useState({
    firstMidName: "",
    lastName: "",
    address: "",
    cccd: "",
  });
  const [editUser, setEditUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifyProps, setNotifyProps] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://localhost:5001/api/UserManagement",
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      const customers = response.data.result.filter(
        (user) => user.role === "Customer"
      );
      setUsers(customers);
      setCurrentPage(1);
    } catch (error) {
      showNotification("Lỗi khi tải danh sách: " + error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [storedToken]);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstMidName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const updated = {
        ...editUser,
        firstMidName: editUser.firstMidName,
        lastName: editUser.lastName,
        address: editUser.address,
        cccd: editUser.cccd,
        role: editUser.role,
      };

      await axios.put(
        `https://localhost:5001/api/UserManagement/UpdateUser/${editUser.id}`,
        updated,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      setEditUser(null);
      setShowForm(false);
      fetchUsers();
      showNotification("success", "Cập nhật nhân viên thành công!");
    } catch (error) {
      console.error("Error updating user:", error);
      showNotification("Cập nhật khách hàng thất bại: " + error.message);
    }
  };

  const openModal = (type, user = null) => {
    setActionType(type);
    setEditUser(user);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (actionType === "add") {
      setNewUser({ ...newUser, [name]: value });
    } else {
      setEditUser({ ...editUser, [name]: value });
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
          Quản lý khách hàng
        </h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-xs">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      Họ tên
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Tên đăng nhập
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-gray-500">
                        Không có khách hàng nào
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100 transition-colors`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.firstMidName} {user.lastName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.userName}
                        </td>
                        <td className="px-6 py-4 text-sm flex space-x-2">
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded"
                            onClick={() => openModal("view", user)}
                          >
                            Xem
                          </button>
                          <button
                            className="px-3 py-1 bg-yellow-500 text-white rounded"
                            onClick={() => openModal("update", user)}
                          >
                            Chỉnh sửa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <UserCustomerModel
              isOpen={showForm}
              onClose={() => {
                setShowForm(false);
                setEditUser(null);
                setActionType(null);
              }}
              actionType={actionType}
              editUser={editUser}
              onInputChange={handleInputChange}
              onUpdate={handleUpdateUser}
            />

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Hiển thị {indexOfFirstUser + 1} đến{" "}
                {Math.min(indexOfLastUser, filteredUsers.length)} trong tổng số{" "}
                {filteredUsers.length} khách hàng
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

export default AdminUserCustomer;
