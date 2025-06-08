import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserEmployeeModel from '../admin-model/UserEmployeeModel';

const AdminUserEmployee = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ firstMidName: '', lastName: '', address: '', cccd: '' });
    const [editUser, setEditUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [notifyProps, setNotifyProps] = useState(null);
    const storedToken = localStorage.getItem('adminToken');

    const showNotification = (type, message, description = "") => {
        if (notifyProps) return;
        const newNotifyProps = { type, message, description, placement: "topRight" };
        setNotifyProps(newNotifyProps);
        setTimeout(() => setNotifyProps(null), 3000);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://localhost:5001/api/UserManagement', {
                headers: { 'Authorization': `Bearer ${storedToken}` }
            });
            const filtered = response.data.result.filter(user => user.role === 'Employee' || user.role === 'Admin');
            setUsers(filtered);
            console.log(filtered);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (actionType === 'add') {
            setNewUser({ ...newUser, [name]: value });
        } else {
            setEditUser({ ...editUser, [name]: value });
        }
    };

    const handleUpdateUser = async () => {
    try {
        const updated = {
            ...editUser,
            firstMidName: editUser.firstMidName,
            lastName: editUser.lastName,
            address: editUser.address,
            cccd: editUser.cccd,
            role: editUser.role
        };

        await axios.put(`https://localhost:5001/api/UserManagement/UpdateUser/${editUser.id}`, updated, {
            headers: { 'Authorization': `Bearer ${storedToken}` }
        });

        setEditUser(null);
        setShowForm(false);
        fetchUsers();
        showNotification("success", "Cập nhật nhân viên thành công!");
    } catch (error) {
        console.error('Error updating user:', error);
        showNotification("error", "Cập nhật nhân viên thất bại!", error.message);
    }
};


    const openModal = (type, user = null) => {
        setActionType(type);
        setEditUser(user);
        setShowForm(true);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            {notifyProps && (
                <div
                    className={`p-4 mb-4 rounded ${notifyProps.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}
                >
                    <strong>{notifyProps.message}</strong>
                    {notifyProps.description && <p>{notifyProps.description}</p>}
                </div>
            )}

            <h1 className="text-2xl font-bold mb-6 text-center">Danh sách nhân viên</h1>

            <table className="min-w-full bg-white mt-4">
                <thead className="bg-gray-500 text-white">
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Username</th>
                        <th className="py-2 px-4 border-b">Role</th>
                        <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="py-2 px-4 border-b">{user.firstMidName} {user.lastName}</td>
                            <td className="py-2 px-4 border-b">{user.userName}</td>
                            <td className="py-2 px-4 border-b">{user.role}</td>
                            <td className="py-2 px-4 border-b text-center">
                                <button
                                    className="px-4 py-1 bg-yellow-500 text-white rounded"
                                    onClick={() => openModal('update', user)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <UserEmployeeModel
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setEditUser(null);
                    setActionType(null);
                }}
                actionType={actionType}
                editUser={editUser}
                onInputChange={handleInputChange}
                onUpdate={handleUpdateUser}
            />
        </div>
    );
};

export default AdminUserEmployee;
