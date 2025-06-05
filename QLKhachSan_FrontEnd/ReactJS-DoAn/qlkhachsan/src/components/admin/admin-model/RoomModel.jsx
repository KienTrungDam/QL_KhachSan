import React, { useEffect } from 'react';
import Modal from '../Modal';

const RoomModal = ({
    isOpen,
    onClose,
    actionType,
    editRoom,
    newRoom,
    onInputChange,
    onSave,
    onUpdate,
    onDelete,
    categories
}) => {
    const getTitle = () => {
        switch (actionType) {
            case 'add': return 'Thêm Phòng';
            case 'update': return 'Cập Nhật Phòng';
            case 'delete': return 'Xoá Phòng';
            default: return '';
        }
    };

    useEffect(() => {
        if (actionType === 'update' && editRoom) {
            console.log("Editing room:", editRoom);
            console.log("new room:", newRoom);
        }
    }, [actionType, editRoom]);

    const handleFileChange = (e) => {
        const { name, files } = e.target;
    
        if (name === "Images") {
            // Chuyển FileList thành Array
            const imageArray = Array.from(files);  // Sử dụng Array.from để chuyển FileList thành mảng
            onInputChange({ target: { name, value: imageArray } });
        } else if (name === "MainImage") {
            onInputChange({ target: { name, value: files[0] } });
        } else {
            onInputChange({ target: { name, value: value } });
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
                {actionType === 'add' && (
                    <>
                        <label className="block font-medium mt-2">Danh mục phòng</label>
                        <select
                            name="CategoryRoomId"
                            value={newRoom.CategoryRoomId}
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

                        <label className="block font-medium mt-2">Trạng thái</label>
                        <select
                            name="Status"
                            value={newRoom.Status}
                            onChange={onInputChange}
                            className="px-4 py-2 border rounded w-full"
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="Sẵn sàng">Sẵn sàng</option>
                            <option value="Đang sửa">Đang sửa</option>
                            <option value="Đang dọn dẹp">Đang dọn dẹp</option>
                        </select>
                        <label className="block font-medium mt-2">Số phòng</label>
                        <input
                            className="px-4 py-2 border rounded w-full"
                            name="RoomNumber"
                            value={newRoom.RoomNumber}
                            onChange={onInputChange}
                        />
                        <label className="block font-medium mt-2">Số người tối đa</label>
                        <input
                            type="number"
                            className="px-4 py-2 border rounded w-full"
                            name="MaxOccupancy"
                            value={newRoom.MaxOccupancy}
                            onChange={onInputChange}
                        />
                        <label className="block font-medium mt-2">Diện tích</label>
                        <input
                            type="number"
                            className="px-4 py-2 border rounded w-full"
                            name="RoomSize"
                            value={newRoom.RoomSize}
                            onChange={onInputChange}
                        />

                        <label className="block font-medium mt-2">Giá Ngày</label>
                        <input
                            type="number"
                            className="px-4 py-2 border rounded w-full"
                            name="PriceDay"
                            value={newRoom.PriceDay}
                            onChange={onInputChange}
                        />

                        <label className="block font-medium mt-2">Giá Tuần</label>
                        <input
                            type="number"
                            className="px-4 py-2 border rounded w-full"
                            name="PriceWeek"
                            value={newRoom.PriceWeek}
                            onChange={onInputChange}
                        />
                        <label className="block font-medium mt-2">Mô tả</label>
                        <input
                            type="textarea"
                            className="px-4 py-2 border rounded w-full"
                            name="Description"
                            value={newRoom.Description}
                            onChange={onInputChange}
                        />
                        <label className="block mt-2">Ảnh chính</label>
                        <input
                            type="file"
                            name="MainImage"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <label className="block mt-2">Ảnh phụ</label>
                        <input
                            type="file"
                            name="Images"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                        />

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

                {actionType === 'update' && editRoom && (
                    <>
                        <label className="block font-medium mt-2">ID</label>
                        <input
                            type="text"
                            className="px-4 py-2 border rounded w-full bg-gray-200"
                            value={editRoom.id}
                            readOnly
                        />

                        <label className="block font-medium mt-2">Danh mục phòng</label>
                        <select
                            name="CategoryRoomId"
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

                        <label className="block font-medium mt-2">Trạng thái</label>
                        <select
                            name="Status"
                            value={editRoom.status}
                            onChange={onInputChange}
                            className="px-4 py-2 border rounded w-full"
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="Trống">Sãn sàng</option>
                            <option value="Đã thuê">Đang sửa</option>
                            <option value="Đang dọn dẹp">Đang dọn dẹp</option>
                        </select>
                        <label className="block font-medium mt-2">Giá Ngày</label>
                        <input
                            type="number"
                            className="px-4 py-2 border rounded w-full"
                            name="PriceDay"
                            value={editRoom.priceDay}
                            onChange={onInputChange}
                        />

                        <label className="block font-medium mt-2">Giá Giờ</label>
                        <input
                            type="number"
                            className="px-4 py-2 border rounded w-full"
                            name="PriceHour"
                            value={editRoom.priceHour}
                            onChange={onInputChange}
                        />

                        <label className="block font-medium mt-2">Giá Tuần</label>
                        <input
                            type="number"
                            className="px-4 py-2 border rounded w-full"
                            name="PriceWeek"
                            value={editRoom.priceWeek}
                            onChange={onInputChange}
                        />
                        {editRoom.mainImage && (
                            <div className="mt-4">
                                <label className="block font-medium">Ảnh chính</label>
                                <img
                                    src={`https://localhost:5001/${editRoom.mainImage}`}
                                    alt="Main Room Image"
                                    className="w-32 h-32 object-cover mt-2"
                                />
                                <input
                                    type="file"
                                    name="MainImage"
                                    accept="image/*"
                                    onChange={onInputChange}
                                    className="mt-2"
                                />
                            </div>
                        )}

                        {/* Hiển thị ảnh phụ nếu có */}
                        {editRoom.images && editRoom.images.length > 0 && (
                            <div className="mt-4">
                                <label className="block font-medium">Ảnh phụ</label>
                                <div className="flex">
                                    {editRoom.images.map((image, index) => (
                                        <div key={index} className="mr-4">
                                            <img
                                                src={`https://localhost:5001/${image}`}
                                                alt={`Room Image ${index}`}
                                                className="w-32 h-32 object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <input
                                    type="file"
                                    name="Images"
                                    accept="image/*"
                                    multiple
                                    onChange={onInputChange}
                                    className="mt-2"
                                />
                            </div>
                        )}
                        <div className="flex justify-center mt-4">
                            <button
                                className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                                onClick={onUpdate}
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

                {actionType === 'delete' && editRoom && (
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
                            value={editRoom.categoryRoom?.name || ''}
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
                                onClick={onDelete}
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
