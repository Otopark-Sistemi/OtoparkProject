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

  const [logs, setLogs] = useState([]);

  const [filter, setFilter] = useState("all");

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

        let totalCost = 0;
        let entryCount = 0;
        let exitCount = 0;

        const today = new Date().toISOString().slice(0, 10);

        const weeklyEntriesCount = new Array(7).fill(0);
        const weeklyExitsCount = new Array(7).fill(0);

        const updatedLogs = [];

        data.forEach((entry) => {
          const entryDate = new Date(entry.girisSaati);
          const exitDate = entry.cikisSaati ? new Date(entry.cikisSaati) : null;

          // Calculate total cost
          if (entry.totalCost) {
            totalCost += entry.totalCost;
          }

          // Calculate daily entries and exits
          const entryDateStr = entryDate.toISOString().slice(0, 10);
          const exitDateStr = exitDate
            ? exitDate.toISOString().slice(0, 10)
            : null;

          if (entryDateStr === today) {
            entryCount++;
          }

          if (exitDateStr === today) {
            exitCount++;
          }

          // Calculate weekly entries and exits
          const dayOfWeek = entryDate.getDay();
          weeklyEntriesCount[dayOfWeek]++;

          if (exitDate) {
            const exitDayOfWeek = exitDate.getDay();
            weeklyExitsCount[exitDayOfWeek]++;
          }

          // Format log messages
          const formattedEntryTimestamp = formatDate(entryDate);
          const formattedExitTimestamp = exitDate ? formatDate(exitDate) : null;

          if (entryDateStr === today) {
            updatedLogs.push({
              timestamp: formattedEntryTimestamp,
              message: `${entry.blockName} blok ${entry.parkNumber}. park yerine  ${entry.plaka} numaralı araç giriş yaptı.`,
              highlight: true,
            });
          }

          if (exitDateStr === today) {
            updatedLogs.push({
              timestamp: formattedExitTimestamp,
              message: `${entry.blockName} bloğundan ${entry.parkNumber}. park yerine ${entry.plaka} numaralı araç çıkış yaptı. Ödenen Ücret: ${entry.totalCost} TL`,
              highlight: true,
            });
          }
        });

        setTotalCost(totalCost);
        setDailyEntries(entryCount);
        setDailyExits(exitCount);
        setWeeklyEntries(weeklyEntriesCount);
        setWeeklyExits(weeklyExitsCount);
        setLogs(updatedLogs);
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

  const earningsData = {
    labels: ["Toplam Kazanç"],
    datasets: [
      {
        label: "Toplam Kazanç",
        data: [totalCost],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
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

  const formatDate = (date) => {
    const options = { hour12: false, hour: "2-digit", minute: "2-digit" };
    return new Date(date).toLocaleString("tr-TR", options);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/";
  };

  const filteredLogs =
    filter === "all"
      ? logs
      : filter === "entry"
      ? logs.filter((log) => log.message.includes("giriş"))
      : logs.filter((log) => log.message.includes("çıkış"));

  return (
    <div className="p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
        >
          Çıkış Yap
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
        {/* <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Günlük Giriş/Çıkış</h2>
          <p className="text-2xl">
            {dailyEntries}/{dailyExits}
          </p>
        </div> */}
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
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Gelir</h2>
        <div className="h-64">
          <Bar data={earningsData} options={options} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Günlük Giriş/Çıkış Logları</h2>
        <div className="mb-4">
          <label className="block mb-2">Filtrele:</label>
          <select
            value={filter}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">Hepsi</option>
            <option value="entry">Girişler</option>
            <option value="exit">Çıkışlar</option>
          </select>
        </div>
        <div className="overflow-y-auto h-64">
          {filteredLogs.map((log, index) => (
            <div
              key={index}
              className={`flex justify-between items-center px-4 py-2 mb-2 rounded-md ${
                log.message.includes("giriş")  ? "bg-green-100"  : "bg-red-100"  
              }`}
            >
              <p className="text-sm">
                <span className="font-bold">{log.timestamp}: </span>
                {log.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

