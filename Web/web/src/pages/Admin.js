import React, { useState } from "react";

const ParkingLotSetup = () => {
  const [blocks, setBlocks] = useState([]); // Blok bilgileri
  const [blockName, setBlockName] = useState(""); // Blok adı
  const [numParkingSpaces, setNumParkingSpaces] = useState(10); // Varsayılan olarak 10 park yeri
  const [error, setError] = useState(""); // Hata mesajı

  // Blok adını güncelleyen fonksiyon
  const handleBlockNameChange = (e) => {
    setBlockName(e.target.value);
  };

  

  // Araç park yeri sayısını güncelleyen fonksiyon
  const handleParkingSpaceChange = (e) => {
    setNumParkingSpaces(parseInt(e.target.value));
  };

const handleSubmit = async () => {
  try {
    const response = await fetch(
      "http://192.168.138.19:8082/blok/getAll",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      }
    );

    // Cevap başarılı ise
    if (response.ok) {
      const data = await response.json(); // Gelen veriyi JSON olarak çözümle
      console.log(data); // Veriyi konsola yazdır
    } else {
      throw new Error("Blok eklenemedi. Hata kodu: " + response.status);
    }
  } catch (error) {
    // Hata oluştuğunda
    console.error(error.message);
  }
};

const handleReset = () => {
  // Blok bilgilerini sıfırla
  setBlocks([]);
};

  // Blok ve araç park yeri sayısına göre görsel oluşturma fonksiyonu
  const generateParkingLayout = () => {
    return blocks.map((block, index) => (
      <div
        key={`block-${index}`}
        className="mb-4 justify-between items-center flex flex-row gap gap-2"
      >
        <h3 className="bg-green-100 text-lg font-bold p-6 rounded-full">
          Blok {block.name}
        </h3>
        <div className="bg-slate-50 flex flex-wrap p-2 overflow-auto">
          {Array.from({ length: block.capacity }, (_, i) => (
            <div
              key={`block-${index}-parking-space-${i + 1}`}
              className="bg-green-200 border border-green-400 h-14 w-20 flex justify-center items-center rounded-md m-1"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-slate-300 flex flex-col h-screen items-center p-10 justify-center">
      <div className="bg-slate-500 mx-auto h-96 p-20 rounded-3xl">
        <h2 className="text-4xl text-white font-bold text-center py-5 mb-4">
          Otopark Yapılandırma
        </h2>
        <div className="mb-4 items-center justify-center mx-auto w-full">
          <label
            htmlFor="blockName"
            className="mr-14 text-2xl text-white mx-auto"
          >
            Blok Adı:
          </label>
          <input
            type="text"
            id="blockName"
            value={blockName}
            onChange={handleBlockNameChange}
            className="border border-gray-400 p-2 rounded-md"
          />
        </div>
        <div className="mb-4 w-full">
          <label
            htmlFor="numParkingSpaces"
            className=" text-2xl mr-3 text-white"
          >
            Park Yeri Sayısı:
          </label>
          <input
            type="number"
            id="numParkingSpaces"
            value={numParkingSpaces}
            onChange={handleParkingSpaceChange}
            className="border border-gray-400 p-2 rounded-md"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Gönder
        </button>
        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Sıfırla
        </button>
      </div>

      {error && <div className="text-red-600">{error}</div>}
      <div className="m-3 items-center justify-center">
        {generateParkingLayout()}
      </div>
    </div>
  );
};

export default ParkingLotSetup;
