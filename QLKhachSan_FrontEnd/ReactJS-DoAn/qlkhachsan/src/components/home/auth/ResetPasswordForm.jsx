import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notify, setNotify] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const email = query.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      return setNotify("Vui lòng nhập đầy đủ mật khẩu.");
    }
    if (password !== confirmPassword) {
      return setNotify("Mật khẩu không khớp.");
    }

    try {
      await axios.post("https://localhost:5001/api/Auth/reset-password", {
        email,
        token,
        newPassword: password,
      });
      setNotify("Đặt lại mật khẩu thành công! Chuyển hướng...");
      setTimeout(() => navigate("/auth"), 2000);
    } catch (error) {
      setNotify("Token không hợp lệ hoặc đã hết hạn.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Đặt lại mật khẩu
        </h2>
        {notify && <p className="mb-4 text-sm text-red-500 text-center">{notify}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600"
          >
            Đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
