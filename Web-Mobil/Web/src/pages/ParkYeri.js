// App.js

import React, { useState, useRef, useEffect } from "react";
import bg from "../img/bg.jpeg";

const ParkYeri = () => {
  const [blockName, setBlockName] = useState("");
  const [parkNumber, setParkNumber] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const canvasRef = useRef(null);
  const canvasWidth = 800; // Kanvas genişliği
  const canvasHeight = 600; // Kanvas yüksekliği

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    // Canvas üzerindeki noktaları burada görselleştirme işlemleri yapılacak
    drawPoints(context);
  }, [coordinates]);

  useEffect(() => {
    // Event listener for undo (z key)
    const handleUndoKeyPress = (event) => {
      if (event.key === "z" && event.ctrlKey && coordinates.length > 0) {
        handleUndo();
      }
    };

    // Event listener for redo (y key)
    const handleRedoKeyPress = (event) => {
      if (event.key === "y" && event.ctrlKey) {
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleUndoKeyPress);
    window.addEventListener("keydown", handleRedoKeyPress);

    return () => {
      window.removeEventListener("keydown", handleUndoKeyPress);
      window.removeEventListener("keydown", handleRedoKeyPress);
    };
  }, [coordinates]);

  const drawPoints = (context) => {
    // Noktaları çizme işlemi
    context.fillStyle = "red";
    coordinates.forEach(({ x, y }) => {
      context.fillRect(x - 5, y - 5, 10, 10);
    });
  };

  const handleAddPoint = () => {
    // Nokta ekleme işlemi
    if (coordinates.length < 4) {
      const x = Math.floor(Math.random() * canvasWidth);
      const y = Math.floor(Math.random() * canvasHeight);
      setCoordinates([...coordinates, { x, y }]);
    }
  };

  const handleUndo = () => {
    // Geri alma işlemi
    if (coordinates.length > 0) {
      const newCoordinates = [...coordinates];
      newCoordinates.pop();
      setCoordinates(newCoordinates);
    }
  };

  const handleRedo = () => {
    // İleri alma işlemi
    // Gerektiği durumda implemente edilecek
  };

  const handleSubmit = () => {
    // Ekleme işlemi ve fetch isteği
    const payload = {
      blockName,
      parkNumber,
      coordinates,
    };
    console.log("Fetch isteği:", payload);
    // Fetch isteği yapılacak
  };

  return (
    <div className="App bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="relative">
        <img
          src={bg}
          alt="Parking Lot"
          className="w-full h-auto"
        />
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="absolute top-0 left-0"
          onClick={handleAddPoint}
        />
        <div className="absolute top-0 right-0 p-4 bg-gray-200">
          <h2 className="text-lg font-bold mb-2">Park Yeri Bilgileri</h2>
          <div className="mb-4">
            <label className="block mb-1">Blok Adı:</label>
            <input
              type="text"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Park Yeri Numarası:</label>
            <input
              type="text"
              value={parkNumber}
              onChange={(e) => setParkNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={coordinates.length !== 4 || !blockName || !parkNumber}
            className={`w-full py-2 bg-blue-500 text-white rounded-md ${
              coordinates.length !== 4 || !blockName || !parkNumber
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            Park Yeri Ekle
          </button>
          <button
            onClick={handleUndo}
            disabled={coordinates.length === 0}
            className={`w-full mt-2 py-2 bg-gray-300 text-gray-600 rounded-md ${
              coordinates.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-400"
            }`}
          >
            Geri Al
          </button>
          <button
            onClick={handleRedo}
            className="w-full mt-2 py-2 bg-gray-300 text-gray-600 rounded-md hover:bg-gray-400"
          >
            İleri Al
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkYeri;
