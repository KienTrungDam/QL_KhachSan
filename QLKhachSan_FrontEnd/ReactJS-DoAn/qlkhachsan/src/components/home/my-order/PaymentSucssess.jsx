import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = params.get("bookingId");
  const sessionId = params.get("session_id");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    const confirmPayment = async () => {
      try {
        await axios.post(
          "https://localhost:5001/api/Payment/ConfirmPayment",
          sessionId,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Đã xác nhận thanh toán");
      } catch (error) {
        console.error("Lỗi xác nhận thanh toán:", error);
      }
    };

    if (sessionId) {
      confirmPayment();
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Thanh toán thành công!</h1>
        <p className="text-lg text-gray-700">
          Cảm ơn bạn đã đặt phòng và sử dụng dịch vụ tại{" "}
          <span className="font-semibold text-yelow-600">Sky Resort</span>.
        </p>
        <p className="mt-2 text-gray-600">
          Mã đặt phòng của bạn: <span className="font-semibold text-black">#{bookingId}</span>
        </p>

        <button
          onClick={() => navigate("/my-order")}
          className="mt-6 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition border-none hover:border-none focus:outline-none"
        >
          Xem đơn đặt phòng của tôi
        </button>

      </div>
    </div>
  );
}
