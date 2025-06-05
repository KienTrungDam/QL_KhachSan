import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUserCustomer = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://localhost:5001/api/UserManagement');
                const customers = response.data.result.filter(user => user.role === 'Customer');
                setUsers(customers);
                console.log(customers)                                                       
            } catch (error) {
                setError('Error fetching users');
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Danh sách khách hàng</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <table className="min-w-full bg-white">
                <thead className="bg-gray-500 text-white">
                <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Username</th>
                    <th className="py-2 px-4 border-b">Role</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td className="py-2 px-4 border-b">{user.firstMidName} {user.lastName}</td>
                        <td className="py-2 px-4 border-b">{user.userName}</td>
                        <td className="py-2 px-4 border-b">{user.role}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserCustomer;