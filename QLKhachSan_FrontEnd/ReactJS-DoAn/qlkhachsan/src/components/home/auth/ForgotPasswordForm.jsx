import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import homeimage from "../../../images/home/homeimage.png"; // Đảm bảo đúng đường dẫn

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [notify, setNotify] = useState(null);
  const [notifyProps, setNotifyProps] = useState(null);
  const showNotification = (type, message, description = "") => {
    if (notifyProps) return;
    const newNotifyProps = {
      type,
      message,
      description,
      placement: "topRight",
    };
    setNotifyProps(newNotifyProps);
    setTimeout(() => setNotifyProps(null), 3000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return setNotify("Vui lòng nhập email.");
    }

    try {
      await axios.post("https://localhost:5001/api/Auth/forgot-password", { email });
      showNotification("success", "Gửi email thành công vui lòng kiểm tra email của bạn!");
    } catch (error) {
      showNotification("error", "Gửi email thất bại!");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Ảnh nền mờ */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-90 z-0"
        style={{ backgroundImage: `url(${homeimage})` }}
      ></div>
      {notifyProps && (
          <div
            className={`fixed top-4 right-4 p-4 rounded shadow-lg z-50 ${
              notifyProps.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <strong>{notifyProps.message}</strong>
            {notifyProps.description && <p>{notifyProps.description}</p>}
          </div>
        )}
      {/* Nội dung chính */}
      <div className="relative z-10 w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Quên mật khẩu
        </h2>
        {notify && (
          <p className="mb-4 text-sm text-red-500 text-center">{notify}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors"
          >
            Gửi email đặt lại mật khẩu
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/auth" className="text-yellow-500 hover:underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
