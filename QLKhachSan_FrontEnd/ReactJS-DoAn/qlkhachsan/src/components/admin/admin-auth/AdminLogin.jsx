import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        if (!loginData.username || !loginData.password) {
            setLoginError('Vui lòng nhập đủ thông tin');
            return;
        }

        try {
            const response = await axios.post('https://localhost:5001/api/Auth/login', { ...loginData, role: 'eb13f950-b452-4b34-b47d-49aff2d16790' });

            // Store JWT token and user's name in localStorage
            localStorage.setItem('adminToken', response.data.result.token);
            console.log(response.data.result)
            localStorage.setItem('adminLastName', response.data.result.user.lastName);
            localStorage.setItem('adminFirstMidNameName', response.data.result.user.firstMidName);
            localStorage.setItem('adminUserName', response.data.result.user.userName);
            localStorage.setItem('adminAddress', response.data.result.user.address);
            localStorage.setItem('adminCCCD', response.data.result.user.cccd);
            localStorage.setItem('adminUserID', response.data.result.user.id);
            localStorage.setItem('adminRole', response.data.result.user.role);
            // Redirect to homepage after successful login
            navigate('/admin/dashboard');
        } catch (error) {
            setLoginError('Tên đăng nhập hoặc mật khẩu không đúng');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                            value={loginData.username}
                            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />
                    </div>
                    {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;