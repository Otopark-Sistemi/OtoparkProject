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
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

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

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Static data for demonstration
  const staticData = [
    {
      id: 1,
      parkNumber: 1,
      blockNumber: "A",
      giris: "2024-05-24 08:00:00",
      cikis: "2024-05-24 12:00:00",
      totalCost: 20,
    },
    {
      id: 2,
      parkNumber: 2,
      blockNumber: "A",
      giris: "2024-05-24 09:00:00",
      cikis: "2024-05-24 11:00:00",
      totalCost: 15,
    },
    {
      id: 3,
      parkNumber: 3,
      blockNumber: "B",
      giris: "2024-05-24 07:30:00",
      cikis: "2024-05-24 13:30:00",
      totalCost: 25,
    },
    {
      id: 4,
      parkNumber: 4,
      blockNumber: "B",
      giris: "2024-05-24 10:00:00",
      cikis: "2024-05-24 14:00:00",
      totalCost: 30,
    },
    {
      id: 5,
      parkNumber: 5,
      blockNumber: "C",
      giris: "2024-05-24 11:00:00",
      cikis: "2024-05-24 15:00:00",
      totalCost: 20,
    },
  ];

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
      highlighted: false,
    },
    {
      timestamp: "2024-05-20 10:05:00",
      message: "34 XYZ 789 plakalı araç çıkış yaptı.",
      highlighted: false,
    },
  ]);

  useEffect(() => {
    setIsLoading(true); // Start loading
    const interval = setInterval(() => {
      const newLog = {
        timestamp: new Date().toISOString(),
        message: "Yeni araç giriş yaptı.",
        highlighted: true,
      };
      setLogs((prevLogs) => {
        const updatedLogs = [...prevLogs, newLog];
        return updatedLogs.slice(-10); // Limit logs to last 10 entries
      });

      setTimeout(() => {
        setLogs((prevLogs) =>
          prevLogs.map((log, index) =>
            index === prevLogs.length - 1 ? { ...log, highlighted: false } : log
          )
        );
      }, 15000);
      setIsLoading(false); // End loading
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
      {isLoading && (
        <div className="flex items-center justify-center  h-screen">
          <SkeletonTheme color="black" highlightColor="red">
            <div className="p-6">
              <Skeleton height={40} width={200} />
              <Skeleton height={240} style={{ marginTop: "10rem" }} />
              <Skeleton height={240} style={{ marginTop: "10rem" }} />
              <Skeleton height={240} style={{ marginTop: "10rem" }} />
              <Skeleton height={240} style={{ marginTop: "10rem" }} />
              <Skeleton height={160} style={{ marginTop: "10rem" }} />
            </div>
          </SkeletonTheme>
        </div>
      )}

      {!isLoading && (
        <>
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

          {/* Logout Butonu */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
            >
              Çıkış Yap
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
              <h2  className="text-xl font-bold mb-4">
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
          <h2 className="text-2xl font-bold mb-4">Canlı Veri Akışı</h2>
          <div className="p-4 rounded-lg shadow-md mx-auto bg-slate-300 justify-center items-center h-64 overflow-y-auto mb-6">
            <ul className="bg-slate-50">
              {logs.map((log, index) => (
                <li
                  key={index}
                  className={`border-b-2 p-2 mb-2 ${
                    log.highlighted ? "bg-green-200" : ""
                  }`}
                >
                  <span className="bg-slate-400 p-1 font-bold font-italic">
                    {log.timestamp}
                  </span>{" "}
                  -{" "}
                  <span className="p-1 font-semibold font-italic">
                    {log.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ücretlendirme Tablosu */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Ücretlendirme Bilgileri</h2>
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2">Park Number</th>
                  <th className="py-2 px-4 border-b-2">Block Number</th>
                  <th className="py-2 px-4 border-b-2">Giriş</th>
                  <th className="py-2 px-4 border-b-2">Çıkış</th>
                  <th className="py-2 px-4 border-b-2">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {staticData.map((data) => (
                  <tr key={data.id}>
                    <td className="py-2 px-4 border-b">{data.parkNumber}</td>
                    <td className="py-2 px-4 border-b">{data.blockNumber}</td>
                    <td className="py-2 px-4 border-b">{data.giris}</td>
                    <td className="py-2 px-4 border-b">{data.cikis}</td>
                    <td className="py-2 px-4 border-b">{data.totalCost} ₺</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

