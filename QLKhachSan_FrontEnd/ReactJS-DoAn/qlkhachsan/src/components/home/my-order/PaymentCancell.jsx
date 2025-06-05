
import { useSearchParams } from "react-router-dom";

export default function PaymentCancel() {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Thanh toán bị hủy</h1>
        <p className="text-lg text-gray-700">
          Rất tiếc! Bạn đã hủy thanh toán cho đơn đặt phòng 
          <span className="font-semibold text-black"> #{bookingId}</span>.
        </p>
        <p className="mt-2 text-gray-600">
          Nếu đây là sự nhầm lẫn, bạn có thể thử thanh toán lại từ trang đơn hàng.
        </p>
        <a
          href="/my-order"
          className="inline-block mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
        >
          Quay lại đơn hàng
        </a>
      </div>
    </div>
  );
}
