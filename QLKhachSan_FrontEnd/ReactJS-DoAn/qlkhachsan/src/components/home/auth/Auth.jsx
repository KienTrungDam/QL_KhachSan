import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import homeimage from "../../../images/home/homeimage.png";
import axios from "axios";

const AuthForms = () => {
  const [activeTab, setActiveTab] = useState("login");
  const location = useLocation();
  const [forgotEmail, setForgotEmail] = useState("");

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
    email: "",
    cccd: "",
    address: "",
    lastName: "",
    firstMidName: "",
  });
  const [notifyProps, setNotifyProps] = useState(null);
  const navigate = useNavigate();

  const showNotification = (type, message, description = "") => {
    setNotifyProps({ type, message, description });
    setTimeout(() => setNotifyProps(null), 3000);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    setActiveTab(mode === "signup" ? "signup" : "login");
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      return showNotification("error", "Lỗi", "Vui lòng nhập đủ thông tin");
    }

    try {
      const response = await axios.post(
        "https://localhost:5001/api/Auth/login",
        { ...loginData }
      );

      localStorage.setItem("token", response.data.result.token);
      localStorage.setItem("userName", response.data.result.user.userName);
      localStorage.setItem("userId", response.data.result.user.id);
      localStorage.setItem("role", response.data.result.user.role);
      localStorage.setItem(
        "firstMidName",
        response.data.result.user.firstMidName
      );
      localStorage.setItem("lastName", response.data.result.user.lastName);
      localStorage.setItem("address", response.data.result.user.address);
      localStorage.setItem("cccd", response.data.result.user.cccd);

      navigate("/");
    } catch (error) {
      showNotification(
        "error",
        "Đăng nhập thất bại",
        "Tên đăng nhập hoặc mật khẩu không đúng"
      );
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const {
      userName,
      password,
      confirmPassword,
      email,
      cccd,
      address,
      firstMidName,
      lastName,
    } = signupData;

    if (
      !userName ||
      !password ||
      !confirmPassword ||
      !email ||
      !cccd ||
      !address ||
      !firstMidName ||
      !lastName
    ) {
      return showNotification(
        "error",
        "Thiếu thông tin",
        "Vui lòng điền đầy đủ thông tin"
      );
    }

    if (password !== confirmPassword) {
      return showNotification(
        "error",
        "Mật khẩu không khớp",
        "Vui lòng kiểm tra lại mật khẩu"
      );
    }

    if (password.length < 8) {
      return showNotification(
        "error",
        "Mật khẩu yếu",
        "Mật khẩu phải có ít nhất 8 ký tự"
      );
    }

    try {
      await axios.post("https://localhost:5001/api/Auth/register", {
        ...signupData,
        role: "b4cbe8b5-4d85-4328-9a17-baea175ef454",
      });

      showNotification(
        "success",
        "Đăng ký thành công",
        "Bạn có thể đăng nhập ngay"
      );
      setActiveTab("login");
    } catch (error) {
      showNotification("error", "Đăng ký thất bại", "Vui lòng thử lại sau");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Ảnh nền mờ */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-90 z-0"
        style={{ backgroundImage: `url(${homeimage})` }}
      ></div>

      {/* Nội dung chính */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Welcome
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Đăng nhập hoặc đăng ký tài khoản mới
        </p>

        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 text-center border-b-2 ${
              activeTab === "login"
                ? "border-yellow-500 text-yellow-500"
                : "border-transparent text-gray-500 hover:border-transparent"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Đăng nhập
          </button>
          <button
            className={`flex-1 py-2 text-center border-b-2 ${
              activeTab === "signup"
                ? "border-yellow-500 text-yellow-500"
                : "border-transparent text-gray-500 hover:border-transparent"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Đăng ký
          </button>
        </div>

        {notifyProps && (
          <div
            className={`mb-4 p-3 rounded-md text-white ${
              notifyProps.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            <strong>{notifyProps.message}</strong>
            {notifyProps.description && (
              <p className="text-sm mt-1">{notifyProps.description}</p>
            )}
          </div>
        )}

        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Login
            </button>
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-yellow-500 hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Quên mật khẩu?
              </button>
            </div>
          </form>
        )}

        {activeTab === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên người dùng
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nhập tên đăng nhập"
                  value={signupData.userName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, userName: e.target.value })
                  }
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nhập mật khẩu"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhập lại mật khẩu
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Xác nhận mật khẩu"
                  value={signupData.confirmPassword}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nhập địa chỉ"
                  value={signupData.address}
                  onChange={(e) =>
                    setSignupData({ ...signupData, address: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CCCD
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nhập CCCD"
                  value={signupData.cccd}
                  onChange={(e) =>
                    setSignupData({ ...signupData, cccd: e.target.value })
                  }
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nhập email"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nhập tên"
                  value={signupData.lastName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, lastName: e.target.value })
                  }
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ đệm
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nhập họ đệm"
                  value={signupData.firstMidName}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      firstMidName: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Đăng ký
            </button>
          </form>
        )}
        {activeTab === "forgot" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!forgotEmail) {
                return showNotification("error", "Vui lòng nhập email");
              }

              try {
                await axios.post(
                  "https://localhost:5001/api/Auth/forgot-password",
                  {
                    email: forgotEmail,
                  }
                );

                showNotification(
                  "success",
                  "Gửi email thành công",
                  "Vui lòng kiểm tra email để đặt lại mật khẩu"
                );
                setActiveTab("login");
              } catch (error) {
                showNotification(
                  "error",
                  "Lỗi",
                  "Không thể gửi yêu cầu. Vui lòng kiểm tra email"
                );
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhập email đã đăng ký
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Email của bạn"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Gửi yêu cầu
            </button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className="text-sm text-gray-500 hover:underline"
              >
                Quay lại đăng nhập
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-4">
          <Link to="/" className="text-yellow-500 hover:underline">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;
