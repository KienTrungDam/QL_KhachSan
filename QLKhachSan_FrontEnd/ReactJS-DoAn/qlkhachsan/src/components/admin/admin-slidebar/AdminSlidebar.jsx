import { useState } from "react";
import {
  FiChevronLeft,
  FiUsers,
  FiLayers,
  FiClipboard,
  FiList,
  FiHome,
  FiFileText,
  FiCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const [activeItem, setActiveItem] = useState("");
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const role = localStorage.getItem("role");
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubMenuToggle = (title) => {
    setOpenSubMenu((prev) => (prev === title ? null : title));
  };

  const menuItems = [
    { title: "Danh sách phòng", to: "/admin/dashboard/room", icon: FiHome },
    { title: "Danh mục dịch vụ", to: "/admin/dashboard/service", icon: FiList },
    {
      title: "Danh mục loại phòng",
      to: "/admin/dashboard/category-room",
      icon: FiLayers,
    },
    {
      title: "Người dùng",
      icon: FiUsers,
      children: [
        { title: "Khách hàng", to: "/admin/dashboard/customer" },
        { title: "Nhân viên", to: "/admin/dashboard/employee" },
        ...(role === "Admin"
          ? [{ title: "Phân quyền", to: "/admin/dashboard/role" }]
          : []),
      ],
    },
    {
      title: "Đặt phòng & dịch vụ",
      icon: FiClipboard,
      children: [
        { title: "Đơn đặt", to: "/admin/dashboard/booking" },
        // { title: "Đơn dịch vụ", to: "/admin/dashboard/booking-service" },
        // { title: "Đơn đặt phòng", to: "/admin/dashboard/booking-room" },
        { title: "Thanh toán", to: "/admin/dashboard/payment" },
      ],
    },
    { title: "Tin tức", to: "/admin/dashboard/new", icon: FiFileText },
  ];

  return (
    <motion.div
      initial={{ width: isExpanded ? 240 : 80 }}
      animate={{ width: isExpanded ? 240 : 80 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-slate-900 text-white fixed left-0 top-0 z-50 shadow-lg "
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 flex justify-center">
          {isExpanded ? (
            <div className="inline-flex items-center gap-2 border-b border-slate-700 pb-2">
              <img
                src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9"
                alt="Logo"
                className="w-8 h-8 rounded object-cover"
              />
              <Link
                to="/admin/dashboard"
                className="font-bold text-lg text-white hover:text-white"
              >
                Admin Menu
              </Link>

              {/* <span className="font-bold text-lg">Admin Menu</span> */}
            </div>
          ) : (
            <div className="inline-flex border-b border-slate-700 pb-2">
              <img
                src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9"
                alt="Logo"
                className="w-8 h-8 rounded object-cover"
              />
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item, idx) =>
              item.children ? (
                <li key={idx}>
                  <button
                    onClick={() => handleSubMenuToggle(item.title)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      openSubMenu === item.title
                        ? "bg-emerald-500 text-white cursor-default"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="font-medium"
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  <AnimatePresence>
                    {openSubMenu === item.title && isExpanded && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-8 mt-1 space-y-1"
                      >
                        {item.children.map((sub, subIdx) => (
                          <li key={subIdx}>
                            <Link
                              to={sub.to}
                              onClick={() => setActiveItem(sub.title)}
                              className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors duration-200 ${
                                activeItem === sub.title
                                  ? "bg-slate-700 text-white cursor-default"
                                  : "text-slate-400 hover:bg-slate-700 hover:text-white"
                              }`}
                            >
                              <FiCircle
                                className={`w-3 h-3 flex-shrink-0 ${
                                  activeItem === sub.title
                                    ? "text-emerald-500"
                                    : "text-slate-500"
                                }`}
                              />
                              <span>{sub.title}</span>
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={idx}>
                  <Link
                    to={item.to}
                    onClick={() => setActiveItem(item.title)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeItem === item.title
                        ? "bg-emerald-500 text-white cursor-default"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                    style={
                      activeItem === item.title ? { pointerEvents: "auto" } : {}
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="font-medium"
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-slate-700 mt-auto">
          <button
            onClick={toggleSidebar}
            className="p-2 w-full flex justify-center rounded-lg hover:bg-slate-700 border-none hover:border-none focus:outline-none focus:ring-0"
          >
            <FiChevronLeft
              className={`w-5 h-5 transition-transform ${
                isExpanded ? "rotate-0" : "rotate-180"
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
