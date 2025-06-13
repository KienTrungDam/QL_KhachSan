import React from "react";
import Modal from "../Modal";

const NewModal = ({
  isOpen,
  onClose,
  actionType,
  editNews,
  newNews,
  onInputChange,
  onSave,
  setNewNews,
  setEditNews,
  errors,
}) => {
  const getTitle = () => {
    switch (actionType) {
      case "add":
        return "Thêm Tin Tức";
      case "update":
        return "Cập Nhật Tin Tức";
      case "delete":
        return "Xoá Tin Tức";
      default:
        return "";
    }
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      if (actionType === "add") {
        setNewNews((prev) => ({
          ...prev,
          [name]: file, // name là "imageUrl"
        }));
      } else if (actionType === "update") {
        setEditNews((prev) => ({
          ...prev,
          [name]: file,
        }));
      }
    }
  };

  const data = actionType === "add" ? newNews : editNews;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-200 px-4 py-3 rounded-t flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{getTitle()}</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-black text-xl font-bold focus:outline-none"
        >
          &times;
        </button>
      </div>

      <div className="p-4">
        {(actionType === "add" || (actionType === "update" && editNews)) && (
          <>
            {actionType === "update" && (
              <>
                <label className="block font-medium mt-2">ID</label>
                <input
                  type="text"
                  className="px-4 py-2 border rounded w-full bg-gray-200"
                  value={editNews.id}
                  readOnly
                />
              </>
            )}

            <label className="block font-medium mt-2">Tiêu đề</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full"
              name="title"
              value={data.title}
              onChange={onInputChange}
            />
            {errors.title && (
              <p className="text-red-600 text-sm">{errors.title}</p>
            )}

            <label className="block font-medium mt-2">Nội dung</label>
            <textarea
              className="px-4 py-2 border rounded w-full"
              name="content"
              rows="4"
              value={data.content}
              onChange={onInputChange}
            />
            {errors.content && (
              <p className="text-red-600 text-sm">{errors.content}</p>
            )}
            <label className="block font-medium mt-2">Hình ảnh</label>
            {data.imageUrl &&
              actionType === "update" &&
              typeof data.imageUrl === "string" && (
                <div className="mt-4">
                  <div className="relative inline-block">
                    <img
                      src={`https://localhost:5001/${data.imageUrl.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt="Ảnh xem trước"
                      className="w-32 h-32 object-cover"
                    />
                    {/* <button
                    onClick={() => onDeleteImage(mainImage.id)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transform translate-x-2 -translate-y-2 hover:bg-red-800"
                  >
                    ×
                  </button> */}
                  </div>
                </div>
              )}
            <input
              type="file"
              name="imageUrl"
              accept="image/*"
              onChange={handleFileChange}
            />
            {errors.imageUrl && (
              <p className="text-red-600 text-sm">{errors.imageUrl}</p>
            )}
            <label className="block font-medium mt-2">Tác giả</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full"
              name="author"
              value={data.author}
              onChange={onInputChange}
            />
            {errors.author && (
              <p className="text-red-600 text-sm">{errors.author}</p>
            )}
            <div className="flex justify-center mt-4">
              <button
                className={`px-4 py-2 text-white rounded mr-2 ${
                  actionType === "add" ? "bg-green-500" : "bg-yellow-500"
                }`}
                onClick={onSave}
              >
                {actionType === "add" ? "Lưu" : "Cập nhật"}
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

        {actionType === "delete" && editNews && (
          <>
            <label className="block font-medium mt-2">Id</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editNews.id}
              readOnly
            />

            <label className="block font-medium mt-2">Tiêu đề</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editNews.title}
              readOnly
            />

            <label className="block font-medium mt-2">Nội dung</label>
            <textarea
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editNews.content}
              readOnly
            />

            <label className="block font-medium mt-2">Tác giả</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editNews.author}
              readOnly
            />

            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                onClick={onSave}
              >
                Xoá
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={onClose}
              >
                Huỷ
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default NewModal;
