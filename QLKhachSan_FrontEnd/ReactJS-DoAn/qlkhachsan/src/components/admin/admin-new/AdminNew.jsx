import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import NewModal from "../admin-model/NewModel";

const AdminNew = () => {
  const [newsList, setNewsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newNews, setNewNews] = useState({
    title: "",
    content: "",
    imageUrl: null,
    author: "",
  });
  const [errors, setErrors] = React.useState({});
  const [editNews, setEditNews] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [notifyProps, setNotifyProps] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const storedToken = localStorage.getItem("token");
  const validateRoom = () => {
    const target = actionType === "add" ? newNews : editNews;
    const newErrors = {};

    if (!target.title) newErrors.title = "Tiêu đề không được để trống";
    if (!target.content) newErrors.content = "Nội dung không được để trống";
    if (!target.imageUrl) newErrors.imageUrl = "Ảnh không được để trống";
    if (!target.author) newErrors.author = "Tác giả không được để trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleClose = () => {
    setShowForm(false);
    setEditNews(null);
    setNewNews({
      ftitle: "",
      content: "",
      imageUrl: null,
      author: "",
    });
    setActionType(null);
    setErrors({});
  };
  const handleSave = async () => {
    const isValid = validateRoom();
    if (!isValid) return;

    if (actionType === "add") {
      await handleAddNews();
    } else if (actionType === "update") {
      await handleUpdateNews();
    } else if (actionType === "delete") {
      await handleDeleteNews();
    }
  };
  const fetchNews = async () => {
    try {
      const response = await axios.get("https://localhost:5001/api/New", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setNewsList(response.data.result || []);
    } catch (error) {
      showNotification("error", "Lỗi khi tải tin tức", error.message);
    }
  };

  const showNotification = (type, message, description = "") => {
    if (notifyProps) return;
    setNotifyProps({ type, message, description });
    setTimeout(() => setNotifyProps(null), 3000);
  };

  const filteredNews = newsList.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (actionType === "add") {
      setNewNews({ ...newNews, [name]: value });
    } else {
      setEditNews({ ...editNews, [name]: value });
    }
  };

  const handleAddNews = async () => {
    try {
      console.log("e", newNews.imageUrl); // nên in typeof cũng được
      const formData = new FormData();
      formData.append("Title", newNews.title);
      formData.append("Content", newNews.content);
      formData.append("Author", newNews.author);

      if (newNews.imageUrl instanceof File) {
        formData.append("ImageUrl", newNews.imageUrl); // key trùng với tên biến trong controller
      }

      await axios.post("https://localhost:5001/api/New", formData, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      setShowForm(false);
      setNewNews({ title: "", content: "", imageUrl: null, author: "" });
      fetchNews();
      showNotification("success", "Thêm tin tức thành công!");
    } catch (error) {
      showNotification("error", "Thêm tin tức thất bại", error.message);
    }
  };

  const handleUpdateNews = async () => {
    try {
      console.log("eeee", editNews.imageUrl);
      const formData = new FormData();
      formData.append("Id", editNews.id); // thêm ID nếu API cần
      formData.append("Title", editNews.title);
      formData.append("Content", editNews.content);
      formData.append("Author", editNews.author);

      if (editNews.imageUrl instanceof File) {
        formData.append("ImageUrl", editNews.imageUrl);
      }

      await axios.put(
        `https://localhost:5001/api/New/${editNews.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showNotification("success", "Cập nhật tin tức thành công!");
      setShowForm(false);
      fetchNews();
    } catch (error) {
      console.error("Update failed:", error);
      showNotification("error", "Cập nhật thất bại", error.message);
    }
  };

  const handleDeleteNews = async () => {
    try {
      await axios.delete(`https://localhost:5001/api/New/${editNews.id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setShowForm(false);
      fetchNews();
      showNotification("success", "Xoá tin tức thành công!");
    } catch (error) {
      showNotification("error", "Xoá thất bại", error.message);
    }
  };

  const openModal = (type, item = null) => {
    setActionType(type);
    setEditNews(item);
    setShowForm(true);
  };

  useEffect(() => {
    fetchNews();
  }, []);

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
          Quản lý tin tức
        </h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="relative max-w-xs flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm tiêu đề..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button
              className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => openModal("add")}
            >
              <FaPlus className="inline mr-2" />
              Thêm tin
            </button>
          </div>

          <NewModal
            isOpen={showForm}
            onClose={handleClose}
            actionType={actionType}
            editNews={editNews}
            newNews={newNews}
            onInputChange={handleInputChange}
            onSave={handleSave}
            setNewNews={setNewNews}
            setEditNews={setEditNews}
            errors={errors}
          />

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Tác giả
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentNews.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      Không có tin tức nào
                    </td>
                  </tr>
                ) : (
                  currentNews.map((item, index) => (
                    <tr
                      key={item.id}
                      className={index % 2 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 text-sm">{item.title}</td>
                      <td className="px-6 py-4 text-sm">{item.author}</td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-2">
                        <img
                          src={
                            item.imageUrl
                              ? `https://localhost:5001/${item.imageUrl.replace(
                                  /\\/g,
                                  "/"
                                )}`
                              : "https://via.placeholder.com/80x60?text=No+Image"
                          }
                          alt={item.title}
                          className="w-20 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => openModal("update", item)}
                          className="text-yellow-500 hover:text-yellow-700"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => openModal("delete", item)}
                          className="text-red-500 hover:text-red-700"
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

          {/* Pagination */}
          <div className="flex justify-between items-center p-4">
            <div className="text-sm text-gray-500">
              Hiển thị {indexOfFirstItem + 1} đến{" "}
              {Math.min(indexOfLastItem, filteredNews.length)} trên tổng số{" "}
              {filteredNews.length} tin
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border text-sm bg-gray-100 hover:bg-gray-200"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded border text-sm ${
                      currentPage === page
                        ? "bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border text-sm bg-gray-100 hover:bg-gray-200"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNew;
