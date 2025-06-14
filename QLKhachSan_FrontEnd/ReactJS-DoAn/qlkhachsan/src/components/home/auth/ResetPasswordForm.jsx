import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import homeimage from "../../../images/home/homeimage.png";

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
      return setNotify({ type: "error", message: "Vui lòng nhập đầy đủ mật khẩu." });
    }
    if (password !== confirmPassword) {
      return setNotify({ type: "error", message: "Mật khẩu không khớp." });
    }

    try {
      await axios.post("https://localhost:5001/api/Auth/reset-password", {
        email,
        token,
        newPassword: password,
      });

      setNotify({ type: "success", message: "Đặt lại mật khẩu thành công! Đang chuyển hướng..." });
      setTimeout(() => navigate("/auth"), 2000);
    } catch (error) {
      setNotify({ type: "error", message: "Token không hợp lệ hoặc đã hết hạn." });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Nền mờ */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-90 z-0"
        style={{ backgroundImage: `url(${homeimage})` }}
      ></div>

      {/* Nội dung chính */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Đặt lại mật khẩu
        </h2>

        {notify && (
          <div
            className={`mb-4 p-3 rounded-md text-white text-center ${
              notify.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {notify.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors"
          >
            Đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
