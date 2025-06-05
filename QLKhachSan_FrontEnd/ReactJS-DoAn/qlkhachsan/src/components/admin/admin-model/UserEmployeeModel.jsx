import React from 'react';
import Modal from '../Modal';

const UserEmployeeModel = ({ isOpen, onClose, actionType, editUser, onInputChange, onUpdate }) => {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
                <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin nhân viên</h2>
                <div className="mb-4">
                    <label className="block mb-1">First Name</label>
                    <input
                        type="text"
                        name="firstMidName"
                        value={editUser?.firstMidName || ''}
                        onChange={onInputChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={editUser?.lastName || ''}
                        onChange={onInputChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={editUser?.address || ''}
                        onChange={onInputChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">CCCD</label>
                    <input
                        type="text"
                        name="cccd"
                        value={editUser?.cccd || ''}
                        onChange={onInputChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 bg-gray-300 text-black rounded"
                        onClick={onClose}
                    >
                        Huỷ
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={onUpdate}
                    >
                        Cập nhật
                    </button>
                </div>
        </Modal>
    );
};

export default UserEmployeeModel;
