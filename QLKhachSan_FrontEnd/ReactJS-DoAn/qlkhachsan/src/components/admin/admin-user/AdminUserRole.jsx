import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";

const AdminUserRoles = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const storedToken = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://localhost:5001/api/UserManagement",
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setUsers(response.data.result);
        console.log(response.data.result);
      } catch (error) {
        showNotification("Lỗi khi tải người dùng: " + error.message);
      }
    };

    fetchUsers();
  }, [storedToken]);

  const handleRoleChange = async (userId, newRole) => {
    setLoading(true);
    try {
      await axios.put(
        `https://localhost:5001/api/UserManagement/${userId}?role=${newRole}`,
        { id: userId, role: newRole },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      showNotification("Cập nhật vai trò thành công!");
    } catch (error) {
      showNotification("Lỗi cập nhật: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <IoMdNotifications className="mr-2" />
          {notification}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Quản lý phân quyền
        </h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-xs">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r bg-gray-500 text-white">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Họ tên
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Tên đăng nhập
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                      Vai trò
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.firstMidName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hover:bg-gray-100 transition-colors rounded-md">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          disabled={loading}
                        >
                          <option value="Customer">Customer</option>
                          <option value="Admin">Admin</option>
                          <option value="Employee">Employee</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Hiển thị {indexOfFirstItem + 1} đến{" "}
                {Math.min(indexOfLastItem, filteredUsers.length)} trong tổng số{" "}
                {filteredUsers.length} người dùng
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tiếp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserRoles;
