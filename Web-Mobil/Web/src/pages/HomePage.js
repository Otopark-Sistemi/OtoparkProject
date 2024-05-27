import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Genel bilgiler için state
  const [totalCars, setTotalCars] = useState(100);
  const [emptySpots, setEmptySpots] = useState(20);
  const [occupiedSpots, setOccupiedSpots] = useState(80);
  const [dailyEntries, setDailyEntries] = useState(50);
  const [dailyExits, setDailyExits] = useState(45);

  // Grafik verisi
  const barData = {
    labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cts", "Paz"],
    datasets: [
      {
        label: "Günlük Girişler",
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Günlük Çıkışlar",
        data: [2, 3, 20, 5, 1, 4, 2],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: ["Dolu", "Boş"],
    datasets: [
      {
        data: [occupiedSpots, emptySpots],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)"],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
  };

  // Canlı veri akışı için state ve effect
  const [logs, setLogs] = useState([
    {
      timestamp: "2024-05-20 10:00:00",
      message: "34 ABC 123 plakalı araç giriş yaptı.",
    },
    {
      timestamp: "2024-05-20 10:05:00",
      message: "34 XYZ 789 plakalı araç çıkış yaptı.",
    },
  ]);

  /*
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/api/live-data')
        .then(response => response.json())
        .then(data => setLogs(prevLogs => [...prevLogs, ...data]));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  */

  // Filtreleme için state ve handler
  const [filter, setFilter] = useState("all");

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Logout handler
  const handleLogout = () => {
    // Oturum bilgilerini temizle
    localStorage.removeItem("userToken");
    // Oturum kapatma işlemi sonrası yönlendirme (örneğin, giriş sayfasına)
    window.location.href = "/";
  };

  return (
    <div className="p-6">
      {/* Logout Butonu */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Genel Bilgiler */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Toplam Araç</h2>
          <p className="text-2xl">{totalCars}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Boş Park Yeri</h2>
          <p className="text-2xl">{emptySpots}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Dolu Park Yeri</h2>
          <p className="text-2xl">{occupiedSpots}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Günlük Giriş/Çıkış</h2>
          <p className="text-2xl">
            {dailyEntries}/{dailyExits}
          </p>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">
            Haftalık Giriş/Çıkış Grafiği
          </h2>
          <div className="h-64">
            <Bar data={barData} options={options} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Doluluk Oranı</h2>
          <div className="h-64">
            <Pie data={pieData} options={options} />
          </div>
        </div>
      </div>

      {/* Canlı Veri Akışı */}
      <div className="bg-white p-4 rounded-lg shadow-md h-64 overflow-y-auto mb-6">
        <h2 className="text-xl font-bold mb-4">Canlı Veri Akışı</h2>
        <ul>
          {logs.map((log, index) => (
            <li key={index} className="mb-2">
              {log.timestamp} - {log.message}
            </li>
          ))}
        </ul>
      </div>

      {/* Filtreleme */}
      <div className="mb-6">
        <label htmlFor="filter" className="mr-4">
          Filtre:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="p-2 border rounded-lg"
        >
          <option value="all">Hepsi</option>
          <option value="today">Bugün</option>
          <option value="week">Bu Hafta</option>
          <option value="month">Bu Ay</option>
        </select>
      </div>
    </div>
  );
};

export default Dashboard;
