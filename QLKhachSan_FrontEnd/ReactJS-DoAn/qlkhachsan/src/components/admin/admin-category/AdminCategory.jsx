import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryModal from "../admin-model/CategoryModel";
import { FaEdit, FaTrash } from "react-icons/fa";
const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editCategory, setEditCategory] = useState(null);
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
    setTimeout(() => {
      setNotifyProps(null);
    }, 3000);
  };

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
      setNewCategory({ ...newCategory, [name]: value });
    } else if (actionType === "update" || actionType === "delete") {
      setEditCategory({ ...editCategory, [name]: value });
    }
  };

  const handleAddCategory = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("description", newCategory.description);

      await axios.post("https://localhost:5001/api/CategoryRoom", formData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setNewCategory({ name: "", description: "", capacity: "" });
      setShowForm(false);
      fetchCategories();
      showNotification("success", "Thêm danh mục thành công!");
    } catch (error) {
      console.error("Error adding category:", error);
      showNotification("error", "Thêm danh mục thất bại!", error.message);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      const formData = new FormData();
      formData.append("id", editCategory.id);
      formData.append("name", editCategory.name);
      formData.append("description", editCategory.description);

      await axios.put(
        `https://localhost:5001/api/CategoryRoom/${editCategory.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setEditCategory(null);
      setShowForm(false);
      fetchCategories();
      showNotification("success", "Cập nhật danh mục thành công!");
    } catch (error) {
      console.error("Error updating category:", error);
      showNotification("error", "Cập nhật danh mục thất bại!", error.message);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await axios.delete(
        `https://localhost:5001/api/CategoryRoom/${editCategory.id}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setEditCategory(null);
      setShowForm(false);
      fetchCategories();
      showNotification("success", "Xoá danh mục thành công!");
    } catch (error) {
      console.error("Error deleting category:", error);
      showNotification("error", "Xoá danh mục thất bại!", error.message);
    }
  };

  const openModal = (type, category = null) => {
    setActionType(type);
    setEditCategory(category);
    setShowForm(true);
  };

  useEffect(() => {
    fetchCategories();
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
        <h1 className="text-2xl font-bold">Danh sách danh mục</h1>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => openModal("add")}
        >
          Add Category
        </button>
      </div>

      <CategoryModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditCategory(null);
          setActionType(null);
        }}
        actionType={actionType}
        editCategory={editCategory}
        newCategory={newCategory}
        onInputChange={handleInputChange}
        onSave={handleAddCategory}
        onUpdate={handleUpdateCategory}
        onDelete={handleDeleteCategory}
      />

      <table className="min-w-full bg-white mt-4">
        <thead className="bg-gray-500 text-white">
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="py-2 px-4 border-b text-center">{category.id}</td>
              <td className="py-2 px-4 border-b">{category.name}</td>
              <td className="py-2 px-4 border-b">{category.description}</td>
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

export default AdminCategory;
