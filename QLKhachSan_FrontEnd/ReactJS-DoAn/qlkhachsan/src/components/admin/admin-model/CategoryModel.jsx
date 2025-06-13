import React from "react";
import Modal from "../Modal";

const CategoryModal = ({
  isOpen,
  onClose,
  actionType,
  editCategory,
  newCategory,
  onInputChange,
  onSave,
  onUpdate,
  onDelete,
  errors,
}) => {
  // Tạo tiêu đề chính cho modal
  const getTitle = () => {
    switch (actionType) {
      case "add":
        return "Thêm Danh Mục";
      case "update":
        return "Cập Nhật Danh Mục";
      case "delete":
        return "Xoá Danh Mục";
      default:
        return "";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-200 px-4 py-3 rounded-t flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{getTitle()}</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-black text-xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
      <div className="p-4">
        {actionType === "add" && (
          <>
            <label className="block font-medium mt-2">Category Name</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full"
              name="name"
              value={newCategory.name}
              onChange={onInputChange}
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name}</p>
            )}
            <label className="block font-medium mt-2">Description</label>
            <textarea
              className="px-4 py-2 border rounded w-full"
              name="description"
              value={newCategory.description}
              onChange={onInputChange}
            />
            {errors.description && (
              <p className="text-red-600 text-sm">{errors.description}</p>
            )}
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                onClick={onSave}
              >
                Lưu
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={onClose}
              >
                Hủy
              </button>
            </div>
          </>
        )}

        {actionType === "update" && editCategory && (
          <>
            <label className="block font-medium mt-2">ID</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editCategory.id}
              readOnly
            />

            <label className="block font-medium mt-2">Category Name</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full"
              name="name"
              value={editCategory.name}
              onChange={onInputChange}
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name}</p>
            )}
            <label className="block font-medium mt-2">Description</label>
            <textarea
              className="px-4 py-2 border rounded w-full"
              name="description"
              value={editCategory.description}
              onChange={onInputChange}
            />
            {errors.description && (
              <p className="text-red-600 text-sm">{errors.description}</p>
            )}
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                onClick={onSave}
              >
                Cập nhật
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={onClose}
              >
                Hủy
              </button>
            </div>
          </>
        )}

        {actionType === "delete" && editCategory && (
          <>
            <label className="block font-medium mt-2">ID</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editCategory.id}
              readOnly
            />

            <label className="block font-medium mt-2">Category Name</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editCategory.name}
              readOnly
            />

            <label className="block font-medium mt-2">Description</label>
            <textarea
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editCategory.description}
              readOnly
            />

            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                onClick={onSave}
              >
                Xóa
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={onClose}
              >
                Hủy
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CategoryModal;
