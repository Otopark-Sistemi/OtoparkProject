import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { format } from "date-fns";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const Dashboard = () => {
  // Genel bilgiler için state
  const [totalCars, setTotalCars] = useState(100);
  const [emptySpots, setEmptySpots] = useState(20);
  const [occupiedSpots, setOccupiedSpots] = useState(80);
  const [dailyEntries, setDailyEntries] = useState(50);
  const [dailyExits, setDailyExits] = useState(45);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dailyEarnings, setDailyEarnings] = useState([0, 0, 0, 0, 0, 0, 0]);

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
    setIsLoading(true); // Loading başladı
    const interval = setInterval(() => {
      const newLog = {
        timestamp: new Date().toISOString(),
        message: "Yeni araç giriş yaptı.",
        highlighted: true,
      };
      setLogs((prevLogs) => {
        const updatedLogs = [...prevLogs, newLog];
        return updatedLogs.slice(-10); // Logları son 10 giriş ile sınırla
      });

      setTimeout(() => {
        setLogs((prevLogs) =>
          prevLogs.map((log, index) =>
            index === prevLogs.length - 1 ? { ...log, highlighted: false } : log
          )
        );
      }, 15000);
      setIsLoading(false); // Loading bitti
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-slate-400 h-screen">
        <SkeletonTheme color="black" highlightColor="red">
          <div className="p-6">
            <Skeleton height={40} width={200} />
            <Skeleton height={240} style={{ marginTop: "1rem" }} />
            <Skeleton height={240} style={{ marginTop: "1rem" }} />
            <Skeleton height={240} style={{ marginTop: "1rem" }} />
            <Skeleton height={240} style={{ marginTop: "1rem" }} />
            <Skeleton height={160} style={{ marginTop: "1rem" }} />
          </div>
        </SkeletonTheme>
      </div>
    );
  }

  return (
    <div className="p-6">
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
          <h2 className="text-2xl font-bold mb-4">Günlük Giriş ve Çıkışlar</h2>
          <Bar data={barData} options={options} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Park Durumu</h2>
          <Pie data={pieData} options={options} />
        </div>
      </div>
      {/* Canlı Loglar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Canlı Loglar</h2>
        <div className="overflow-y-auto h-96">
          {logs.map((log, index) => (
            <p
              key={index}
              className={`${
                log.highlighted ? "bg-red-100" : ""
              } p-2 rounded-lg mb-2`}
            >
              <span className="text-gray-500 mr-2">
                {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
              </span>
              {log.message}
            </p>
          ))}
        </div>
      </div>

      {/* Günlük Kazanç Grafiği */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Günlük Kazanç (TL)</h2>
        <Bar
          data={{
            labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cts", "Paz"],
            datasets: [
              {
                label: "Günlük Kazanç",
                data: dailyEarnings,
                backgroundColor: "rgba(255, 159, 64, 0.6)",
              },
            ],
          }}
          options={options}
        />
      </div>

      {/* Genel Bilgiler ve Buton */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Toplam Gelir</h2>
          <p className="text-2xl">{totalRevenue} TL</p>
        </div>
      </div>

      {/* Çıkış Bilgisi */}
      {/* Burada çıkış yapan araç için ek bir bilgi kutusu ekledim */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Son Çıkış Bilgisi</h2>
        <div className="flex items-center">
          <div className="h-8 w-8 bg-red-500 rounded-full mr-2"></div>
          <p className="text-xl font-bold">Bir araç çıkış yaptı.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default Dashboard;