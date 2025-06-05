import React, { useEffect, useState } from "react";
import logo from "../../../images/home/logo.png";
import { Link, useNavigate } from "react-router-dom";
import BookingForm from "../Booking/Booking";

function Header() {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isBookingAnimating, setIsBookingAnimating] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  const handleScrollOrNavigate = (id) => {
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/?scrollTo=${id}`);
    }
  };

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "");
    setUserRole(localStorage.getItem("role") || "");

    // Add scroll listener for header background effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Hàm mở modal booking với hiệu ứng
  const openBookingForm = () => {
    setShowBookingForm(true);
    // Kích hoạt hiệu ứng sau khi component được render
    setTimeout(() => setIsBookingAnimating(true), 10);
  };

  // Hàm đóng modal booking với hiệu ứng
  const closeBookingForm = () => {
    setIsBookingAnimating(false);
    // Đợi hết thời gian animation rồi mới ẩn hoàn toàn
    setTimeout(() => setShowBookingForm(false), 300);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50"
            : "bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100"
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent hidden sm:block group-hover:from-yellow-600 group-hover:to-orange-500 transition-all duration-300">
              Sky Resort
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 font-medium">
            <span
              className="relative cursor-pointer text-gray-700 hover:text-yellow-600 transition-all duration-300 group py-2"
              onClick={() => handleScrollOrNavigate("about")}
            >
              Giới thiệu
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </span>
            <span
              className="relative cursor-pointer text-gray-700 hover:text-yellow-600 transition-all duration-300 group py-2"
              onClick={() => handleScrollOrNavigate("service")}
            >
              Dịch vụ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </span>
            <span
              className="relative cursor-pointer text-gray-700 hover:text-yellow-600 transition-all duration-300 group py-2"
              onClick={() => handleScrollOrNavigate("room")}
            >
              Phòng
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </span>
            <span
              className="relative cursor-pointer text-gray-700 hover:text-yellow-600 transition-all duration-300 group py-2"
              onClick={() =>
                document
                  .getElementById("news")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Tin tức & Sự kiện
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4 text-sm">
            <button
              className="relative px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group overflow-hidden"
              onClick={openBookingForm}
            >
              <span className="relative z-10">Đặt phòng</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {userRole === "Admin" && (
              <Link
                to="/admin/dashboard/"
                className="relative px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Quản lý
              </Link>
            )}

            {userName ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 font-medium text-gray-800 hover:text-yellow-600 border-none outline-none focus:outline-none ring-0 focus:ring-0 px-3 py-2 rounded-full hover:bg-yellow-50 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">Xin chào, {userName}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    ></div>
                    <div className={`absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-2 space-y-1     transition-all duration-150 ease-out transform ${dropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"} pointer-events-${dropdownOpen ? "auto" : "none"}`}>
                      {" "}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          Tài khoản
                        </p>
                        <p className="text-xs text-gray-500">{userName}</p>
                      </div>
                      <Link
                        to="/my-order"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-800 hover:bg-yellow-50 hover:text-yellow-600 rounded-xl transition-all duration-200 group"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-yellow-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        <span>Đơn đã đặt</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 border-none outline-none focus:outline-none ring-0 focus:ring-0 group"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth?mode=login"
                  className="text-gray-600 hover:text-yellow-600 font-medium px-4 py-2 rounded-full hover:bg-yellow-50 transition-all duration-300"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="text-white bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 font-medium px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {showBookingForm && (
        <>
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] transition-all duration-300 ${
              isBookingAnimating ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeBookingForm}
          ></div>
          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-[85%] md:w-[70%] lg:w-[40%] bg-white z-[10001] shadow-2xl transition-all duration-300 ease-out ${
              isBookingAnimating ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <button
              onClick={closeBookingForm}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 text-xl font-bold focus:outline-none focus:ring-0 border-0 rounded-full transition-all duration-300 z-10"
            >
              ×
            </button>
            <div className="p-6 h-full overflow-auto">
              <BookingForm closeModal={closeBookingForm} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Header;
