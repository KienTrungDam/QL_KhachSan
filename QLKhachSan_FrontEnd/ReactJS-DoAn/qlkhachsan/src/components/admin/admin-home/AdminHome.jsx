import { useEffect, useState } from "react";
import axios from "axios"; // Đảm bảo đã cài: npm install axios
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { format } from "date-fns";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminHome = ({ isDarkMode = false }) => {
  const [roomTypeStats, setRoomTypeStats] = useState([]);
  const [stats, setStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const baseUrl = "https://localhost:5001/api/Statistic"; // 👉 Thay bằng URL thực tế
        const [
          roomsRes,
          occupiedRes,
          bookingsRes,
          customersRes,
          revenueRes,
          roomTypeRes,
        ] = await Promise.all([
          axios.get(`${baseUrl}/TotalRooms`),
          axios.get(`${baseUrl}/RoomsOccupiedToday`),
          axios.get(`${baseUrl}/TodayBookings`),
          axios.get(`${baseUrl}/TotalCustomers`),
          axios.get(`${baseUrl}/RevenueLast7Days`),
          axios.get(`${baseUrl}/BookingCountByRoomType`),
        ]);

        setStats([
          { title: "Tổng số phòng", value: roomsRes.data.result, icon: "🏨" },
          {
            title: "Phòng đang thuê hôm nay",
            value: occupiedRes.data.result,
            icon: "🔑",
          },
          {
            title: "Đơn đặt hôm nay",
            value: bookingsRes.data.result,
            icon: "📅",
          },
          {
            title: "Tổng khách hàng",
            value: customersRes.data.result,
            icon: "👥",
          },
        ]);
        setRevenueData(revenueRes.data.result);
        setRoomTypeStats(roomTypeRes.data.result);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", error);
      }
    };

    fetchStats();
  }, []);

  // Dữ liệu biểu đồ cột (doanh thu)
  const chartData = {
    labels: revenueData.map((data) =>
      format(new Date(data.date), "MMM dd")
    ),
    datasets: [
      {
        label: "Doanh thu hàng ngày",
        data: revenueData.map((data) => data.totalRevenue),
        backgroundColor: isDarkMode
          ? "rgba(96, 165, 250, 0.8)"
          : "rgba(37, 99, 235, 0.8)",
        borderColor: isDarkMode ? "#60A5FA" : "#2563EB",
        borderWidth: 1,
        borderRadius: 5,
        categoryPercentage: 0.7,
        barPercentage: 0.9,
      },
    ],
  };

  // Dữ liệu biểu đồ tròn (loại phòng)
  const roomTypeData = {
    labels: roomTypeStats.map((item) => item.roomType),
    datasets: [
      {
        data: roomTypeStats.map((item) => item.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDarkMode ? "#E5E7EB" : "#374151",
        },
      },
      title: {
        display: true,
        text: "Tổng quan doanh thu 7 ngày qua",
        color: isDarkMode ? "#E5E7EB" : "#374151",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
          color: isDarkMode ? "#E5E7EB" : "#374151",
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: isDarkMode ? "#E5E7EB" : "#374151",
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: isDarkMode ? "#E5E7EB" : "#374151",
        },
      },
      title: {
        display: true,
        text: "Tỷ lệ đặt phòng theo loại phòng",
        color: isDarkMode ? "#E5E7EB" : "#374151",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
  };

  return (
    <div
      className={`p-6 space-y-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <div className="h-[400px]">
            <Bar data={chartData} options={options} />
          </div>
        </div>
        <div
          className={`p-6 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <div className="h-[400px]">
            <Pie data={roomTypeData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
