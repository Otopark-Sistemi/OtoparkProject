import React, { useEffect, useState } from "react";
import car from "../img/car.svg"; // Adjust the path as necessary

const Otoparkım = () => {
  const [veri, setVeri] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.209.210:8082/blok/getAll");
        const data = await response.json();
        setVeri(data);
        console.log("Gelen Veri:", data);
      } catch (error) {
        console.error("Veri alınamadı: ", error);
      }
    };

    fetchData();

    const timer = setInterval(fetchData, 4000);

    return () => clearInterval(timer);
  }, []);

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
          <p className="text-2xl p-4">
            ARAÇ BULUNAMADI
          </p>
        </div>
      ) : (
        <div className="gap-1 flex justify-center">
          {veri.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto"
            >
              <h3 className="text-2xl font-semibold mb-4 text-center">
                {item.blok_adi}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(item.park_alan_durum).map((status, index) => (
                  <div
                    key={index}
                    className={`w-24 h-24 rounded-md ${
                      status ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Otoparkım;
