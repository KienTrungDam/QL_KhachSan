import React, { useEffect } from "react";
import Modal from "../Modal";

const RoomModal = ({
  isOpen,
  onClose,
  actionType,
  editRoom,
  newRoom,
  onInputChange,
  onSave,
  categories,
  onDeleteImage,
  errors,
}) => {
  const getTitle = () => {
    switch (actionType) {
      case "add":
        return "Thêm Phòng";
      case "update":
        return "Cập Nhật Phòng";
      case "delete":
        return "Xoá Phòng";
      default:
        return "";
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "images") {
      // Chuyển FileList thành Array
      const imageArray = Array.from(files); // Sử dụng Array.from để chuyển FileList thành mảng
      onInputChange({ target: { name, value: imageArray } });
    } else if (name === "mainImage") {
      onInputChange({ target: { name, value: files[0] } });
    } else {
      onInputChange({ target: { name, value: value } });
    }
  };
  const mainImage = editRoom?.roomImages?.find((img) => img.isMain);
  const subImages = editRoom?.roomImages?.filter((img) => !img.isMain) || [];
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
            <div>
              <label className="block font-medium mt-2">Số phòng</label>
              <input
                className="px-4 py-2 border rounded w-full"
                name="roomNumber"
                value={newRoom.roomNumber}
                onChange={onInputChange}
              />
              {errors.roomNumber && (
                <p className="text-red-600 text-sm">{errors.roomNumber}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mt-2">Danh mục phòng</label>
                <select
                  name="categoryRoomId"
                  value={newRoom.categoryRoomId}
                  onChange={onInputChange}
                  className="px-4 py-2 border rounded w-full"
                >
                  <option value="">Chọn danh mục phòng</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryRoomId && (
                  <p className="text-red-600 text-sm">
                    {errors.categoryRoomId}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mt-2">Trạng thái</label>
                <select
                  name="status"
                  value={newRoom.status}
                  onChange={onInputChange}
                  className="px-4 py-2 border rounded w-full"
                >
                  <option value="">Chọn trạng thái</option>
                  <option value="Sẵn sàng">Sẵn sàng</option>
                  <option value="Đang sửa">Đang sửa</option>
                  <option value="Đang dọn dẹp">Đang dọn dẹp</option>
                </select>
                {errors.status && (
                  <p className="text-red-600 text-sm">{errors.status}</p>
                )}
              </div>

              <div>
                <label className="block font-medium mt-2">
                  Số người tối đa
                </label>
                <input
                  type="number"
                  className="px-4 py-2 border rounded w-full"
                  name="maxOccupancy"
                  value={newRoom.maxOccupancy}
                  onChange={onInputChange}
                />
                {errors.maxOccupancy && (
                  <p className="text-red-600 text-sm">{errors.maxOccupancy}</p>
                )}
              </div>

              <div>
                <label className="block font-medium mt-2">Diện tích</label>
                <input
                  type="number"
                  className="px-4 py-2 border rounded w-full"
                  name="roomSize"
                  value={newRoom.roomSize}
                  onChange={onInputChange}
                />
                {errors.roomSize && (
                  <p className="text-red-600 text-sm">{errors.roomSize}</p>
                )}
              </div>

              <div>
                <label className="block font-medium mt-2">Giá Ngày</label>
                <input
                  type="number"
                  className="px-4 py-2 border rounded w-full"
                  name="priceDay"
                  value={newRoom.priceDay}
                  onChange={onInputChange}
                />
                {errors.priceDay && (
                  <p className="text-red-600 text-sm">{errors.priceDay}</p>
                )}
              </div>

              <div>
                <label className="block font-medium mt-2">Giá Tuần</label>
                <input
                  type="number"
                  className="px-4 py-2 border rounded w-full"
                  name="priceWeek"
                  value={newRoom.priceWeek}
                  onChange={onInputChange}
                />
                {errors.priceWeek && (
                  <p className="text-red-600 text-sm">{errors.priceWeek}</p>
                )}
              </div>
            </div>

            <label className="block font-medium mt-2">Mô tả</label>
            <textarea
              className="px-4 py-2 border rounded w-full"
              name="description"
              value={newRoom.description}
              onChange={onInputChange}
            />
            {errors.description && (
              <p className="text-red-600 text-sm">{errors.description}</p>
            )}

            <label className="block mt-2">Ảnh chính</label>
            <input
              type="file"
              name="mainImage"
              accept="image/*"
              onChange={handleFileChange}
            />
            {errors.mainImage && (
              <p className="text-red-600 text-sm">{errors.mainImage}</p>
            )}

            <label className="block mt-2">Ảnh phụ</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            {errors.images && (
              <p className="text-red-600 text-sm">{errors.images}</p>
            )}

            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                onClick={onSave}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {actionType === "update" && editRoom && (
          <>
            <label className="block font-medium mt-2">Id</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editRoom.id}
              readOnly
            />
            <label className="block font-medium mt-2">Số phòng</label>
            <input
              className="px-4 py-2 border rounded w-full"
              name="roomNumber"
              value={editRoom.roomNumber}
              onChange={onInputChange}
            />
            {errors.roomNumber && (
              <p className="text-red-600 text-sm">{errors.roomNumber}</p>
            )}
            {/* Danh mục phòng & Trạng thái */}
            <div className="flex gap-4 mt-2">
              <div className="w-1/2">
                <label className="block font-medium">Danh mục phòng</label>
                <select
                  name="categoryRoomId"
                  value={editRoom.categoryRoomId}
                  onChange={onInputChange}
                  className="px-4 py-2 border rounded w-full"
                >
                  <option value="">Chọn danh mục phòng</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryRoomId && (
                  <p className="text-red-600 text-sm">
                    {errors.categoryRoomId}
                  </p>
                )}
              </div>

              <div className="w-1/2">
                <label className="block font-medium">Trạng thái</label>
                <select
                  name="status"
                  value={editRoom.status}
                  onChange={onInputChange}
                  className="px-4 py-2 border rounded w-full"
                >
                  <option value="">Chọn trạng thái</option>
                  <option value="Sẵn sàng">Sẵn sàng</option>
                  <option value="Đang sửa">Đang sửa</option>
                  <option value="Đang dọn dẹp">Đang dọn dẹp</option>
                </select>
                {errors.status && (
                  <p className="text-red-600 text-sm">{errors.status}</p>
                )}
              </div>
            </div>

            {/* Số người tối đa & Diện tích */}
            <div className="flex gap-4 mt-2">
              <div className="w-1/2">
                <label className="block font-medium">Số người tối đa</label>
                <input
                  type="number"
                  className="px-4 py-2 border rounded w-full"
                  name="maxOccupancy"
                  value={editRoom.maxOccupancy}
                  onChange={onInputChange}
                />
                {errors.maxOccupancy && (
                  <p className="text-red-600 text-sm">{errors.maxOccupancy}</p>
                )}
              </div>

              <div className="w-1/2">
                <label className="block font-medium">Diện tích</label>
                <input
                  type="number"
                  className="px-4 py-2 border rounded w-full"
                  name="roomSize"
                  value={editRoom.roomSize}
                  onChange={onInputChange}
                />
                {errors.roomSize && (
                  <p className="text-red-600 text-sm">{errors.roomSize}</p>
                )}
              </div>
            </div>

            {/* Giá ngày & Giá tuần */}
            <div className="flex gap-4 mt-2">
              <div className="w-1/2">
                <label className="block font-medium">Giá Ngày</label>
                <input
                  type="number"
                  className="px-4 py-2 border rounded w-full"
                  name="priceDay"
                  value={editRoom.priceDay}
                  onChange={onInputChange}
                />
                {errors.priceDay && (
                  <p className="text-red-600 text-sm">{errors.priceDay}</p>
                )}
              </div>

              <div className="w-1/2">
                <label className="block font-medium">Giá Tuần</label>
                <input
                  type="number"
                  className="px-4 py-2 border rounded w-full"
                  name="priceWeek"
                  value={editRoom.priceWeek}
                  onChange={onInputChange}
                />
                {errors.priceWeek && (
                  <p className="text-red-600 text-sm">{errors.priceWeek}</p>
                )}
              </div>
            </div>

            <label className="block font-medium mt-2">Mô tả</label>
            <textarea
              //   type="textarea"
              className="px-4 py-2 border rounded w-full"
              name="description"
              value={editRoom.description}
              onChange={onInputChange}
            />
            {errors.description && (
              <p className="text-red-600 text-sm">{errors.description}</p>
            )}

            {/* Main Image */}
            <label className="block font-medium mb-1">Ảnh chính</label>
            {mainImage && (
              <div className="mt-4">
                <div className="relative inline-block">
                  <img
                    src={`https://localhost:5001/${mainImage.imageUrl.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt="Ảnh chính"
                    className="w-32 h-32 object-cover"
                  />
                  <button
                    onClick={() => onDeleteImage(mainImage.id)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transform translate-x-2 -translate-y-2 hover:bg-red-800"
                  >
                    ×
                  </button>
                </div>

                {/* Nút chọn file nằm riêng dưới ảnh */}
              </div>
            )}
            <input
              type="file"
              name="mainImage"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 block"
            />
            {errors.mainImageEdit && (
              <p className="text-red-600 text-sm">{errors.mainImageEdit}</p>
            )}

            {/* Images */}
            {subImages.length > 0 && (
              <div className="mt-4">
                <label className="block font-medium">Ảnh phụ</label>
                <div className="flex flex-wrap gap-2">
                  {subImages.map((image, index) => (
                    <div key={index} className="relative inline-block">
                      <img
                        src={`https://localhost:5001/${image.imageUrl.replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt={`Ảnh phụ ${index + 1}`}
                        className="w-32 h-32 object-cover"
                      />
                      <button
                        onClick={() => onDeleteImage(image.id)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transform translate-x-2 -translate-y-2 hover:bg-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mt-2"
            />
            {errors.imagesEdit && (
              <p className="text-red-600 text-sm">{errors.imagesEdit}</p>
            )}

            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                onClick={onSave}
              >
                Update
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {actionType === "delete" && editRoom && (
          <>
            <label className="block font-medium mt-2">ID</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editRoom.id}
              readOnly
            />

            <label className="block font-medium mt-2">Danh mục phòng</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editRoom.categoryRoom?.name || ""}
              readOnly
            />

            <label className="block font-medium mt-2">Trạng thái</label>
            <input
              type="text"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editRoom.status}
              readOnly
            />

            <label className="block font-medium mt-2">Giá Ngày</label>
            <input
              type="number"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editRoom.priceDay}
              readOnly
            />

            <label className="block font-medium mt-2">Giá Giờ</label>
            <input
              type="number"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editRoom.priceHour}
              readOnly
            />

            <label className="block font-medium mt-2">Giá Tuần</label>
            <input
              type="number"
              className="px-4 py-2 border rounded w-full bg-gray-200"
              value={editRoom.priceWeek}
              readOnly
            />

            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                onClick={onSave}
              >
                Confirm Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default RoomModal;
