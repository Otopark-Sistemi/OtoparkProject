import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
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
import { ApıUrl } from "../components/ApıUrl";

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
  const [totalCars, setTotalCars] = useState(0);
  const [emptySpots, setEmptySpots] = useState(0);
  const [occupiedSpots, setOccupiedSpots] = useState(0);
  const [dailyEntries, setDailyEntries] = useState(0);
  const [dailyExits, setDailyExits] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const [weeklyEntries, setWeeklyEntries] = useState([]);
  const [weeklyExits, setWeeklyExits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(ApıUrl.get);
        const data = await response.json();

        let occupiedCount = 0;
        let emptyCount = 0;

        data.forEach((item) => {
          const parkStatus = item.park_alan_durum;

          Object.values(parkStatus).forEach((status) => {
            if (status) {
              occupiedCount++;
            } else {
              emptyCount++;
            }
          });
        });

        setOccupiedSpots(occupiedCount);
        setEmptySpots(emptyCount);
        setTotalCars(occupiedCount + emptyCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchEntryExitData = async () => {
      try {
        const response = await fetch(ApıUrl.statistic);
        const data = await response.json();

        const today = new Date().toISOString().slice(0, 10);

        let entryCount = 0;
        let exitCount = 0;

        data.forEach((entry) => {
          const entryDate = entry.girisSaati.slice(0, 10);
          const exitDate = entry.cikisSaati
            ? entry.cikisSaati.slice(0, 10)
            : null;

          if (entryDate === today) {
            entryCount++;
          }

          if (exitDate === today) {
            exitCount++;
          }
        });

        setDailyEntries(entryCount);
        setDailyExits(exitCount);

        const weeklyEntriesCount = new Array(7).fill(0);
        const weeklyExitsCount = new Array(7).fill(0);

        data.forEach((entry) => {
          const entryDate = new Date(entry.girisSaati);
          const exitDate = entry.cikisSaati ? new Date(entry.cikisSaati) : null;

          const dayOfWeek = entryDate.getDay();
          weeklyEntriesCount[dayOfWeek]++;

          if (exitDate) {
            const exitDayOfWeek = exitDate.getDay();
            weeklyExitsCount[exitDayOfWeek]++;
          }
        });

        setWeeklyEntries(weeklyEntriesCount);
        setWeeklyExits(weeklyExitsCount);
      } catch (error) {
        console.error("Error fetching entry/exit data:", error);
      }
    };

    fetchEntryExitData();
  }, []);

  const barData = {
    labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cts", "Paz"],
    datasets: [
      {
        label: "Günlük Girişler",
        data: weeklyEntries,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Günlük Çıkışlar",
        data: weeklyExits,
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

  const costData = {
    labels: ["Toplam Ücret"],
    datasets: [
      {
        label: "Toplam Ücret",
        data: [totalCost],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        suggestedMin: 0,
        suggestedMax: totalCars,
        stepSize: 1,
      },
    },
  };

  const [logs, setLogs] = useState([
    {
      timestamp: "2024-05-20 10:00:00",
      message: "34 ABC 123 plakalı araç giriş yaptı.",
    },
    {
      timestamp: "2024-05-20 10:05:00",
      message: "34 XYZ 789 plakalı araç çıkış yaptı. Ödenen Ücret: 50 TL",
    },
  ]);

  const [filter, setFilter] = useState("all");

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/";
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Toplam Araç Kapasitesi</h2>
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

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Toplam Ücret</h2>
            <div className="h-64">
              <Bar data={costData} options={options} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 hidden">
        <h2 className="text-xl font-bold mb-4 hidden">Log Kayıtları</h2>
        <div className="flex justify-end mb-4">
          <select
            value={filter}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">Tüm Kayıtlar</option>
            <option value="entry">Giriş Kayıtları</option>
            <option value="exit">Çıkış Kayıtları</option>
          </select>
        </div>
        <ul className="divide-y divide-gray-200">
          {logs.map((log, index) => (
            <li className="py-4 flex">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex-1 truncate">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {log.message}
                  </div>
                  <div className="text-sm text-gray-500">{log.timestamp}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

