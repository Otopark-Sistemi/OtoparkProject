import React, { useEffect, useState } from "react";
import car from "../img/car.svg"; // Adjust the path as necessary
import { ApıUrl } from "../components/ApıUrl";

const Otoparkım = () => {
  const [veri, setVeri] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [hoveredSpot, setHoveredSpot] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(ApıUrl.get);
        const data = await response.json();
        setVeri(data);
        console.log("Gelen Veri:", data);
      } catch (error) {
        console.error("Veri alınamadı: ", error);
      }
    };

    fetchData();

    const timer = setInterval(fetchData, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStatisticData = async () => {
      try {
        const response = await fetch(ApıUrl.statistic);
        const data = await response.json();
        setStatistics(data);
        console.log("Statistic Data:", data);
      } catch (error) {
        console.error("Statistic data alınamadı: ", error);
      }
    };

    fetchStatisticData();

    const timer = setInterval(fetchStatisticData, 1000);

    return () => clearInterval(timer);
  }, []);

  // Function to sort the blocks alphabetically by blockName
  const sortBlocksAlphabetically = (blocks) => {
    return blocks.sort((a, b) => a.blockName.localeCompare(b.blockName));
  };

  // Function to calculate the duration parked
  const calculateDuration = (entryTime) => {
    const now = new Date();
    const entry = new Date(entryTime);
    const diff = now.getTime() - entry.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} saat ${minutes} dakika`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl text-center font-bold mb-6">OTOPARK PANELİ</h1>
      {veri.length === 0 ? (
        <div className="flex flex-col mt-40 justify-center items-center h-full">
          <img
            src={car}
            alt="No parking areas"
            className="w-1/2 max-w-md mt-4"
          />
          <p className="text-2xl p-4">ARAÇ BULUNAMADI</p>
        </div>
      ) : (
        <div className="gap-1 flex justify-center">
          {sortBlocksAlphabetically(veri).map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto"
            >
              <h3 className="text-2xl white font-semibold mb-4 text-center">
                {item.blockName} Blok
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(item.park_alan_durum).map(
                  ([spotId, isOccupied]) => {
                    const spotInfo = statistics.find(
                      (stat) => stat.parkNumber === Number(spotId)
                    );
                    const isHovered = hoveredSpot === spotId;
                    return (
                      <div
                        key={spotId}
                        className={`w-24 h-24 rounded-md flex items-center justify-center ${
                          isOccupied ? "bg-red-500" : "bg-green-500"
                        }`}
                        onMouseEnter={() =>
                          isOccupied && setHoveredSpot(spotId)
                        }
                        onMouseLeave={() => setHoveredSpot(null)}
                      >
                        {isOccupied && spotInfo && isHovered ? (
                          <div className="text-center text-md font-semibold p-10">
                            <p>{spotInfo.plaka}</p>
                            <p className="text-sm ">
                              {calculateDuration(spotInfo.girisSaati)}
                            </p>
                          </div>
                        ) : (
                          <span className="text-2xl font-semibold">
                            {spotId}
                          </span>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="fixed bottom-4 left-4 bg-gray-700 p-4 rounded-md shadow-lg">
        <p className="text-lg font-bold">Bilgi Kutusu</p>
        <div className="flex items-center mt-2">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span>Boş Park Yeri</span>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span>Dolu Park Yeri</span>
        </div>
      </div>
    </div>
  );
};

export default Otoparkım;
