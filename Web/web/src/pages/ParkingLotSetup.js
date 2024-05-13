import React, { useEffect, useState } from "react";
import "./ParkingLotSetup.css";

const ParkingLotSetup = () => {
  const [veri, setVeri] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      fetchData();
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://192.168.35.217:8082/blok/getAll");
      const data = await response.json();
      setVeri(data);
      console.log("Gelen Veri:", data);
    } catch (error) {
      console.error("Veri alınamadı: ", error);
    }
  };

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

export default ParkingLotSetup;
