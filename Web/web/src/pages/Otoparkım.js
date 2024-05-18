import React, { useEffect, useState } from "react";
import "./ParkingLotSetup.css";

const Otoparkım = () => {
  const [veri, setVeri] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.1.72:8082/blok/getAll");
        const data = await response.json();
        setVeri(data);
        console.log("Gelen Veri:", data);
      } catch (error) {
        console.error("Veri alınamadı: ", error);
      }
    };

    // Fetch data initially
    fetchData();

    const timer = setInterval(fetchData, 4000);

    // Cleanup interval to avoid memory leaks
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h1 className="text-3xl text-center font-bold text-white mb-4">
        OTOPARK PANELİ
      </h1>

      <div className="parking-lot-container">
        {veri.map((item) => (
          <div key={item.id} className="block-container">
            <h3 className="block-title">{item.blok_adi}</h3>
            <div className="parking-lot">
              {Object.values(item.park_alan_durum).map((status, index) => (
                <div
                  key={index}
                  className={`parking-spot ${status ? "occupied" : "vacant"}`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Otoparkım;
