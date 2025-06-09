// src/components/admin/admin-model/RoomDetailModal.jsx
import React from "react";
import Modal from "../Modal";

const RoomDetailModal = ({ isOpen, onClose, room }) => {
  if (!room) return null;

  const mainImage = room.roomImages?.find((img) => img.isMain);
  const mainImageUrl = mainImage
    ? `https://localhost:5001/${mainImage.imageUrl.replace(/\\/g, "/")}`
    : "https://via.placeholder.com/150";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Chi tiết phòng {room.roomNumber}</h2>
        <img
          src={mainImageUrl}
          alt="Room"
          className="w-full h-64 object-cover rounded mb-4"
        />
        <p><strong>Loại phòng:</strong> {room.categoryRoom?.name}</p>
        <p><strong>Số người tối đa:</strong> {room.maxOccupancy}</p>
        <p><strong>Giá theo ngày:</strong> ${room.priceDay}</p>
        <p><strong>Giá theo tuần:</strong> ${room.priceWeek}</p>
        <p><strong>Trạng thái:</strong> {room.status}</p>
        <p className="mt-2"><strong>Mô tả:</strong> {room.description || "Không có mô tả"}</p>

        {room.roomImages?.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Hình ảnh khác:</h3>
            <div className="grid grid-cols-3 gap-2">
              {room.roomImages.map((img, idx) => (
                <img
                  key={idx}
                  src={`https://localhost:5001/${img.imageUrl.replace(/\\/g, "/")}`}
                  alt={`Room ${idx}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RoomDetailModal;
