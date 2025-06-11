import React, { useState } from "react";
import Sidebar from "./admin-slidebar/AdminSlidebar";
import { Route, Routes } from "react-router-dom";
import AdminRoom from "./admin-room/AdminRoom";
import Header from "./header/AdminHeader";
import AdminCategory from "./admin-category/AdminCategory";
import AdminService from "./admin-service/AdminService";
import AdminUserCustomer from "./admin-user/AdminUserCustomer";
import AdminUserEmployee from "./admin-user/AdminUserEmployee";
import AdminUserRoles from "./admin-user/AdminUserRole";
import AdminBooking from "./admin-booking/AdminBooking";
import AdminPayment from "./admin-booking/AdminPayment";
import AdminBookingRoom from "./admin-booking/AdminBookingRoom";
import AdminBookingService from "./admin-booking/AdminBookingService";
import AdminRoomDetail from "./admin-room/AdminRoomDetail";
import AdminBookingUpdateStatus from "./admin-booking/AdminBookingUpdateStatus";
import AdminBookingDetail from "./admin-booking/AdminBookingDetail";
import AdminHome from "./admin-home/AdminHome";

const AdminDashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="min-h-screen">
      {/* Header cố định trên cùng */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <div className="flex pt-[72px] min-h-screen">
        {/* Truyền isExpanded và setIsExpanded cho Sidebar */}
        <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

        {/* Nội dung chính */}
        <main
          className="flex-1 p-6 bg-gray-100 overflow-auto transition-all duration-300"
          style={{ marginLeft: isSidebarExpanded ? 240 : 80 }}
        >
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="room" element={<AdminRoom />} />
            <Route path="category-room" element={<AdminCategory />} />
            <Route path="service" element={<AdminService />} />
            <Route path="customer" element={<AdminUserCustomer />} />
            <Route path="employee" element={<AdminUserEmployee />} />
            <Route path="role" element={<AdminUserRoles />} />
            <Route path="booking" element={<AdminBooking />} />
            <Route path="payment" element={<AdminPayment />} />
            <Route path="booking-room" element={<AdminBookingRoom />} />
            <Route path="booking-service" element={<AdminBookingService />} />
            <Route path="booking/:bookingId" element={<AdminBookingUpdateStatus />} />
            <Route path="booking-detail/:bookingId" element={<AdminBookingDetail />} />
            <Route path="room/:roomId" element={<AdminRoomDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
