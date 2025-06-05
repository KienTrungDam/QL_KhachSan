import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [notify, setNotify] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return setNotify("Vui lòng nhập email.");
    }

    try {
      await axios.post("https://localhost:5001/api/Auth/forgot-password", { email });
      setNotify("Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.");
    } catch (error) {
      setNotify("Không thể gửi email. Hãy thử lại sau.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Quên mật khẩu
        </h2>
        {notify && <p className="mb-4 text-sm text-red-500 text-center">{notify}</p>}
        <form onSubmit={`handleSubmit`} className="space-y-4">
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600"
          >
            Gửi email đặt lại mật khẩu
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/auth" className="text-yellow-500 underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
