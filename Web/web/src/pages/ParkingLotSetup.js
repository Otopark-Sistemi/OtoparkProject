import React, { useState, useEffect } from "react";

export const ParkingLotSetup = () => {
  // fetchData fonksiyonunu dışarıda tanımla
  const fetchData = async () => {
    try {
      const response = await fetch("http://192.168.138.19:8082/blok/getAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Bir hata oluştu. Hata kodu: " + response.status);
      }

      const data = await response.json();
      console.log("Gelen veri:", data);
      // Veriyi istediğiniz şekilde işleyebilirsiniz, örneğin state'e atayabilirsiniz.
    } catch (error) {
      console.error("Veri getirilirken bir hata oluştu:", error.message);
    }
  };

  return (
    <div>
      {/* Butonun içinde fetchData fonksiyonunu çağır */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={fetchData}
      >
        Veri Getir
      </button>
    </div>
  );
};
