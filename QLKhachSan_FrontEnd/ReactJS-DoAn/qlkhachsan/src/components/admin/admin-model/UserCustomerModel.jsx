import React from "react";
import Modal from "../Modal";

const UserCustomerModel = ({
  isOpen,
  onClose,
  actionType,
  editUser,
  onInputChange,
  onSave,
  errors,
}) => {
  const getTitle = () => {
    if (actionType === "update") return "Cập Nhật Khách Hàng";
    else if (actionType == "view") return "Thông Tin Khách Hàng";

    return "";
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
        {actionType === "view" && editUser && (
          <>
            <label className="block font-medium mt-2">ID</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editUser.id}
              readOnly
            />

            <label className="block font-medium mt-2">Tên</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editUser.lastName}
              readOnly
            />

            <label className="block font-medium mt-2">Họ và tên đệm</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editUser.firstMidName}
              readOnly
            />

            <label className="block font-medium mt-2">Địa chỉ</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editUser.address}
              readOnly
            />

            <label className="block font-medium mt-2">CCCD</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editUser.cccd}
              readOnly
            />

            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={onClose}
              >
                Đóng
              </button>
            </div>
          </>
        )}

        {actionType === "update" && editUser && (
          <>
            <label className="block font-medium mt-2">ID</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editUser.id}
              readOnly
            />
            <label className="block font-medium mt-2">Họ</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full"
              name="lastName"
              value={editUser.lastName}
              onChange={onInputChange}
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm">{errors.lastName}</p>
            )}
            <label className="block font-medium mt-2">Tên và tên đệm</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full"
              name="firstMidName"
              value={editUser.firstMidName}
              onChange={onInputChange}
            />
            {errors.firstMidName && (
              <p className="text-red-600 text-sm">{errors.firstMidName}</p>
            )}
            <label className="block font-medium mt-2">Địa chỉ</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full"
              name="address"
              value={editUser.address}
              onChange={onInputChange}
            />
            {errors.address && (
              <p className="text-red-600 text-sm">{errors.address}</p>
            )}
            <label className="block font-medium mt-2">CCCD</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full"
              name="cccd"
              value={editUser.cccd}
              onChange={onInputChange}
            />
            {errors.cccd && (
              <p className="text-red-600 text-sm">{errors.cccd}</p>
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
                Huỷ
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default UserCustomerModel;
