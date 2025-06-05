import React from 'react';
import Modal from '../Modal';

const ServiceModal = ({
    isOpen,
    onClose,
    actionType,
    editService,
    newService,
    onInputChange,
    onSave,
    onUpdate,
    onDelete
}) => {
    const getTitle = () => {
        switch (actionType) {
            case 'add':
                return 'Thêm Dịch Vụ';
            case 'update':
                return 'Cập Nhật Dịch Vụ';
            case 'delete':
                return 'Xoá Dịch Vụ';
            default:
                return '';
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
                        <label className="block font-medium mt-2">Tên dịch vụ</label>
                        <input
                            type="text"
                            className="px-4 py-2 border rounded w-full"
                            name="name"
                            value={newService.name}
                            onChange={onInputChange}
                        />

                        <label className="block font-medium mt-2">Mô tả</label>
                        <textarea
                            className="px-4 py-2 border rounded w-full"
                            name="description"
                            value={newService.description}
                            onChange={onInputChange}
                        />

                        <label className="block font-medium mt-2">Giá</label>
                        <input
                            type="number"
                            className="px-4 py-2 border rounded w-full"
                            name="price"
                            value={newService.price}
                            onChange={onInputChange}
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

                {actionType === 'update' && editService && (
                    <>
                        <label className="block font-medium mt-2">ID</label>
                        <input
                            type="text"
                            className="px-4 py-2 border rounded w-full bg-gray-200"
                            value={editService.id}
                            readOnly
                        />

                        <label className="block font-medium mt-2">Tên dịch vụ</label>
                        <input
                            type="text"
                            className="px-4 py-2 border rounded w-full"
                            name="name"
                            value={editService.name}
                            onChange={onInputChange}
                        />

                        <label className="block font-medium mt-2">Mô tả</label>
                        <textarea
                            className="px-4 py-2 border rounded w-full"
                            name="description"
                            value={editService.description}
                            onChange={onInputChange}
                        />

                        <label className="block font-medium mt-2">Giá</label>
                        <input
                            type="number"
                            className="px-4 py-2 border rounded w-full"
                            name="price"
                            value={editService.price}
                            onChange={onInputChange}
                        />

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

                {actionType === 'delete' && editService && (
                    <>
                        <label className="block font-medium mt-2">ID</label>
                        <input
                            type="text"
                            className="px-4 py-2 border rounded w-full bg-gray-200"
                            value={editService.id}
                            readOnly
                        />

                        <label className="block font-medium mt-2">Tên dịch vụ</label>
                        <input
                            type="text"
                            className="px-4 py-2 border rounded w-full bg-gray-200"
                            value={editService.name}
                            readOnly
                        />

                        <label className="block font-medium mt-2">Mô tả</label>
                        <textarea
                            className="px-4 py-2 border rounded w-full bg-gray-200"
                            value={editService.description}
                            readOnly
                        />

                        <label className="block font-medium mt-2">Giá</label>
                        <input
                            type="number"
                            className="px-4 py-2 border rounded w-full bg-gray-200"
                            value={editService.price}
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

export default ServiceModal;
