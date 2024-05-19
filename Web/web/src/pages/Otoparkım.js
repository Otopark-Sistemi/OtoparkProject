import React, { useEffect, useState } from "react";

const Otoparkım = () => {
  const [veri, setVeri] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.1.91:8082/blok/getAll");
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
        <div className="flex  justify-center items-center h-full">
          <p className="text-2xl">
            Henüz araç park alanı yok. Lütfen park alanı belirleyin.
          </p>
        </div>
      ) : (
        <div className=" gap-1 flex justify-center">
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
