import "./App.css";
import AdminLogin from "./components/admin/admin-auth/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/home/header/Header";
import Footer from "./components/home/footer/Footer";
import { useState } from "react";
import AuthForms from "./components/home/auth/Auth";
import About from "./components/home/about/About";
import Room from "./components/home/room/Room";
import DetailRoom from "./components/home/room/RoomDetail";
import BookingForm from "./components/home/Booking/Booking";
import MyOrder from "./components/home/my-order/MyOrder";
import PaymentSuccess from "./components/home/my-order/PaymentSucssess";
import PaymentCancel from "./components/home/my-order/PaymentCancell";
import AvailableRooms from "./components/home/Booking/AvailableRooms";
import Service from "./components/home/service/Service";
import HomePage from "./components/home/HomePage";
import News from "./components/home/new/new";
function App() {
  const [user, setUser] = useState(null);
  const userRole = localStorage.getItem("role");

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/auth"
            element={
              <>
                <AuthForms setUser={setUser} />
                <Footer />
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                <Header user={user} />
                <HomePage />
              </>
            }
          />
          <Route
            path="/room"
            element={
              <>
                <Header user={user} />
                <About />
                <Room />
                <Footer />
              </>
            }
          />
          <Route
            path="/service"
            element={
              <>
                <Header user={user} />
                <About />
                <Service />
                <Footer />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Header user={user} />
                <About />
                <Room />
                <Service />
                <Footer />
              </>
            }
          />
          <Route
            path="/news"
            element={
              <>
                <Header user={user} />
                <News />
                <Footer />
              </>
            }
          />
          <Route
            path="/room/:id"
            element={
              <>
                <Header user={user} />
                <DetailRoom />
                <Footer />
              </>
            }
          />
          <Route
            path="/my-order"
            element={
              <>
                <Header user={user} />
                <MyOrder />
                <Footer />
              </>
            }
          />
          <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
          <Route
            path="/payment-success"
            element={
              <>
                <Header user={user} />
                <PaymentSuccess />
                <Footer />
              </>
            }
          />
          <Route
            path="/payment-cancel"
            element={
              <>
                <Header user={user} />
                <PaymentCancel />
                <Footer />
              </>
            }
          />
          <Route
            path="/available-rooms"
            element={
              <>
                <Header user={user} />
                <AvailableRooms />
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
