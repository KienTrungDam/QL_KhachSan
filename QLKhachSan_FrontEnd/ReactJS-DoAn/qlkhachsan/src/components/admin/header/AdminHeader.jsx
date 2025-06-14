import { useState, useEffect, useCallback } from "react";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";

const UserDropdown = ({ user, onLogout }) => {
  return (
    <div className="absolute right-0 top-14 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <p className="text-white font-medium capitalize">{user.name}</p>
        <p className="text-slate-400 text-sm">{user.fullName}</p>
      </div>
      <div className="p-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-slate-700 rounded-md transition-colors"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState({ name: "", fullName: "", lastName: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const lastName = localStorage.getItem("lastName");
    const firstMidName = localStorage.getItem("firstMidName");
    const fullName = `${lastName} ${firstMidName}`.trim();
    if (!name) {
      navigate("/auth");
      return;
    }

    setUser({ name, fullName, lastName });
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/auth");
  }, [navigate]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 z-50 relative">
      <div className="max-w-8xl mx-auto px-2 h-[72px] flex items-center justify-between relative">
        {/* Tên khách sạn ở giữa, màu vàng */}
        <Link
          to="/admin/dashboard"
          className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-white hover:text-white"
        >
          Hệ thống quản lý khách sạn
        </Link>

        {/* Bên phải: Trang chủ + Avatar */}
        <div className="flex items-center gap-4 ml-auto">
          <button
            onClick={goHome}
            className="bg-gray-700 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-600"
            title="Về trang chủ"
          >
            Trang chủ
          </button>

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-3 px-3 py-2 rounded-full hover:bg-slate-800 transition"
            >
              <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold uppercase border-2 border-yellow-400">
                {user.lastName.charAt(0)}
              </div>

              <div className="hidden md:flex items-center text-white capitalize text-sm font-medium">
                {user.fullName}
                <FiChevronDown
                  className={`ml-2 h-4 w-4 text-slate-400 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {isDropdownOpen && (
              <UserDropdown user={user} onLogout={handleLogout} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
