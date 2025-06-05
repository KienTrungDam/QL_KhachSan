import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative bg-white text-gray-800 overflow-hidden border-t border-gray-200">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 via-transparent to-transparent"></div>
            
            <div className="relative pt-8 pb-6 px-6 md:px-20">
                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Cột 1 - Giới thiệu */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold mb-1 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                Về chúng tôi
                            </h3>
                            <div className="w-10 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-3"></div>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Khách sạn của chúng tôi mang đến trải nghiệm nghỉ dưỡng tuyệt vời với dịch vụ chuyên nghiệp và không gian sang trọng.
                        </p>
                        
                        {/* Social Media Icons */}
                        <div className="flex space-x-3 mt-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                                <i className="fab fa-facebook-f text-white text-xs"></i>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 cursor-pointer">
                                <i className="fab fa-instagram text-white text-xs"></i>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-400/25 cursor-pointer">
                                <i className="fab fa-twitter text-white text-xs"></i>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-red-500/25 cursor-pointer">
                                <i className="fab fa-youtube text-white text-xs"></i>
                            </div>
                        </div>
                    </div>

                    {/* Cột 2 - Liên kết */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold mb-1 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                Liên kết nhanh
                            </h3>
                            <div className="w-10 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-3"></div>
                        </div>
                        <ul className="space-y-2">
                            {[
                                { to: "/", label: "Trang chủ", icon: "fas fa-home" },
                                { to: "/about", label: "Giới thiệu", icon: "fas fa-info-circle" },
                                { to: "/menu", label: "Dịch vụ", icon: "fas fa-concierge-bell" },
                                { to: "/booking", label: "Đặt phòng", icon: "fas fa-bed" },
                                { to: "/news", label: "Tin tức & Sự kiện", icon: "fas fa-newspaper" }
                            ].map((link, index) => (
                                <li key={index} className="group">
                                    <Link 
                                        to={link.to} 
                                        className="flex items-center text-gray-600 hover:text-yellow-600 transition-all duration-300 text-sm group-hover:translate-x-1"
                                    >
                                        <i className={`${link.icon} mr-2 text-yellow-500 group-hover:text-yellow-600 transition-colors duration-300 text-xs`}></i>
                                        <span className="relative">
                                            {link.label}
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 group-hover:w-full transition-all duration-300"></span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cột 3 - Liên hệ */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold mb-1 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                Liên hệ
                            </h3>
                            <div className="w-10 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-3"></div>
                        </div>
                        <div className="space-y-2">
                            {[
                                { 
                                    icon: "fas fa-map-marker-alt", 
                                    content: "Thái Bình, Việt Nam",
                                    color: "text-red-400"
                                },
                                { 
                                    icon: "fas fa-envelope", 
                                    content: "dhgtvt@utc.edu.vncontact@hotel.com",
                                    color: "text-blue-400"
                                },
                                { 
                                    icon: "fas fa-phone-alt", 
                                    content: "tel:(84.24) 37663311",
                                    color: "text-green-400"
                                }
                            ].map((contact, index) => (
                                <div key={index} className="group flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
                                    <div className={`w-6 h-6 ${contact.color} rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                        <i className={`${contact.icon} text-xs`}></i>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                                        {contact.content}
                                    </p>
                                </div>
                            ))}
                            
                            {/* Facebook Link with special styling */}
                            <div className="group flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
                                <div className="w-6 h-6 text-blue-400 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <i className="fab fa-facebook text-xs"></i>
                                </div>
                                <a 
                                    href="https://www.facebook.com/dhgtvtcaugiay" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm"
                                >
                                    Fanpage Facebook
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="border-t border-gray-200 pt-4">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                        <div className="text-center md:text-left">
                            <p className="text-xs text-gray-500">
                                © {new Date().getFullYear()} Sky Resort Booking. All rights reserved.
                            </p>
                        </div>
                        <div className="flex space-x-4 text-xs text-gray-500">
                            <a href="#" className="hover:text-yellow-600 transition-colors duration-300">Chính sách bảo mật</a>
                            <a href="#" className="hover:text-yellow-600 transition-colors duration-300">Điều khoản sử dụng</a>
                            <a href="#" className="hover:text-yellow-600 transition-colors duration-300">Hỗ trợ</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;