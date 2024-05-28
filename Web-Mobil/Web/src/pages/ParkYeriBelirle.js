import React, { useState, useEffect, useRef } from "react";
import backgroundImage from "./../img/bg1.png"; // Ensure this path is correct
import car from "../img/car.svg";
import { ApıUrl } from "../components/ApıUrl";

const ParkYeriBelirle = () => {
  const canvasRef = useRef(null);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [points, setPoints] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [blockName, setBlockName] = useState("");
  const [parkNumber, setParkNumber] = useState("");
  const [parkingAreas, setParkingAreas] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const colors = [
    "255, 0, 0",
    "0, 255, 0",
    "0, 0, 255",
    "255, 165, 0",
    "128, 0, 128",
  ];

  useEffect(() => {
    const updateCanvasDimensions = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const { clientWidth, clientHeight } = canvas.parentNode;
        setCanvasDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    window.addEventListener("resize", updateCanvasDimensions);
    updateCanvasDimensions();

    return () => {
      window.removeEventListener("resize", updateCanvasDimensions);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "z") {
        handleUndo();
      } else if (event.ctrlKey && event.key === "y") {
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undoStack, redoStack, points]);
  const isPointInPolygon = (point, polygon) => {
    const { x, y } = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;
      const xj = polygon[j].x;
      const yj = polygon[j].y;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi - yi) + xi;
      if (intersect) inside = !inside;
      j = i;
    }
    return inside;
  };

  const isPolygonOverlap = (poly1, poly2) => {
    for (let i = 0; i < poly1.length; i++) {
      if (isPointInPolygon(poly1[i], poly2)) return true;
    }
    for (let i = 0; i < poly2.length; i++) {
      if (isPointInPolygon(poly2[i], poly1)) return true;
    }
    return false;
  };

  const addPoint = (x, y) => {
    const newPoint = { x, y };

    // Check if the new point is inside any existing parking area
    for (const area of parkingAreas) {
      if (
        area.blockName === blockName &&
        isPointInPolygon(newPoint, area.coordinatesList)
      ) {
        alert("Bu nokta bu park alanının sınırları içinde.");
        return;
      }
    }

    // Combine new points with current points
    const newPoints = [...points, newPoint];

    // If the new points form a polygon, check for overlap with existing areas
    if (newPoints.length === 4) {
      for (const area of parkingAreas) {
        if (isPolygonOverlap(newPoints, area.coordinates)) {
          alert("Bu noktalar başka bir park alanının üstünde.");
          return;
        }
      }
    }

    setUndoStack([...undoStack, points]);
    setRedoStack([]);
    setPoints(newPoints);
    
  };

  const addParkingArea = (blockName) => {
    // Check if the current points form a valid polygon
    if (points.length !== 4) {
      alert("Lütfen 4 nokta seçin.");
      return;
    }

    // Check if the new area overlaps with existing areas
    for (const area of parkingAreas) {
      if (isPolygonOverlap(points, area.coordinates)) {
        alert("Bu alan başka bir park alanının üstünde veya içinde.");
        return;
      }
    }

    const newArea = {
      blockName,
      coordinates: points,
      parkNumber: "1", // Example: Park number
    };

    // Add new area to the list
    setParkingAreas([...parkingAreas, newArea]);

    // Clear points after adding the area
    setPoints([]);
    setUndoStack([]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack.pop();
      setRedoStack([...redoStack, points]);
      setPoints(previousState);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      setUndoStack([...undoStack, points]);
      setPoints(nextState);
    }
  };

  const handleCanvasClick = (event) => {
    if (points.length === 4) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    addPoint(x, y);
  };

  const handleBlockNameChange = (event) => {
    setBlockName(event.target.value.toUpperCase());
  };

  const handleParkNumberChange = (event) => {
    setParkNumber(event.target.value);
  };

  const handleAddToBlock = async () => {
    if (!blockName || !parkNumber || points.length !== 4) {
      alert("Lütfen blok adı, park numarası ve 4 nokta belirleyin.");
      return;
    }

    const existingParkArea = parkingAreas.find(
      (area) => area.blockName === blockName && area.parkNumber === parkNumber
    );

    if (existingParkArea) {
      alert(`Blok ${blockName} için park numarası ${parkNumber} zaten mevcut.`);
      return;
    }

    // Check if the new area overlaps with existing areas
    for (const area of parkingAreas) {
      if (isPolygonOverlap(points, area.coordinates)) {
        alert("Bu alan başka bir park alanının üstünde veya içinde.");
        return;
      }
    }
      setPoints([]);
      setUndoStack([]);
      setRedoStack([]);
    

    const newParkingArea = {
      blockName,
      parkNumber,
      coordinates: points,
    };

    setIsSending(true);
    try {
      const response = await fetch(ApıUrl.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newParkingArea),
      });
      fetchParkingAreas();

      const createdParkingArea = await response.json(); // Parse response JSON

      console.log("Veri başarıyla gönderildi:", createdParkingArea);
      // Update parkingAreas state with the newly created area
      setParkingAreas((prevParkingAreas) => [
        ...prevParkingAreas,
        createdParkingArea,
      ]);

      // Clear points after successfully adding the area
    

      // Refresh parking areas
      fetchParkingAreas();
    } catch (error) {
      console.error("Veri gönderilirken hata oluştu:", error);
    } finally {
      setIsSending(false);
    }
  };

  const fetchParkingAreas = async () => {
    try {
      const response = await fetch(ApıUrl.get, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Veri alınamadı.");
      }

      const data = await response.json();
      console.log("Alınan veri:", data);

      setParkingAreas(data);
    } catch (error) {
      console.error("Veri alınırken hata oluştu:", error);
    }
  };

  const deleteParkingArea = async (blockName, number) => {
    try {
      const response = await fetch(`${ApıUrl.delete}/${blockName}/${number}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Text: ${errorText}`
        );
      }

      console.log("Veri başarıyla silindi:", blockName, number);

      // Update parkingAreas state after deletion
      setParkingAreas((prevParkingAreas) =>
        prevParkingAreas.filter(
          (area) =>
            area.blockName !== blockName ||
            Object.keys(area.coordinatesList).every((key) => key !== number)
        )
      );

    window.location.reload();
    } catch (error) {
      console.error("Veri silinirken hata oluştu:", error);
      alert(`Veri silinirken hata oluştu: ${error.message}`);
    }
  };



  useEffect(() => {
    fetchParkingAreas();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw points
    points.forEach((point, index) => {
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      context.fillStyle = "red";
      context.fill();
    });

    // Draw existing parking areas
    parkingAreas.forEach((area, index) => {
      const color = colors[index % colors.length];
      const coordinatesList = area.coordinatesList;

      if (coordinatesList) {
        Object.entries(coordinatesList).forEach(([parkNumber, coordinates]) => {
          context.beginPath();
          context.moveTo(coordinates[0].x, coordinates[0].y);
          context.lineTo(coordinates[1].x, coordinates[1].y);
          context.lineTo(coordinates[2].x, coordinates[2].y);
          context.lineTo(coordinates[3].x, coordinates[3].y);
          context.closePath();

          context.strokeStyle = `rgba(${color}, 1)`;
          context.fillStyle = `rgba(${color}, 0.5)`;
          context.fill();
          context.stroke();

          // Draw block name and park number
          const centerX = (coordinates[0].x + coordinates[2].x) / 2;
          const centerY = (coordinates[0].y + coordinates[2].y) / 2;
          context.fillStyle = "black";
          context.textAlign = "center";
          context.font = "12px Arial";
          context.fillText(
            `${area.blockName} - ${parkNumber}`,
            centerX,
            centerY
          );
        });
      }
    });
  }, [points, parkingAreas]); // Redraw whenever points or parkingAreas change

  return (
    <div className="flex flex-col bg-gray-900  items-center  h-screen justify-center p-6">
      <h1 className="text-4xl text-center text-white font-bold mb-6">
        PARK ALANLARI
      </h1>

      <div className="flex flex-wrap gap-4 w-full h-screen overflow-y-auto">
        <div
          className="relative w-full h-[31.5rem] bg-contain bg-no-repeat bg-center max-w-4xl  mb-4"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <canvas
            ref={canvasRef}
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            onClick={handleCanvasClick}
            className="w-full h-full border rounded shadow-md"
          ></canvas>
          <div className="absolute bottom-4 left-4 space-x-2">
            <button
              onClick={handleUndo}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            >
              Geri Al
            </button>
            <button
              onClick={handleRedo}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            >
              İleri Al
            </button>
          </div>
       
        </div>

        <div className="flex flex-col h-[40rem] items-center w-full max-w-4xl bg-slate-500 p-4 rounded shadow-md">
          <div className="flex flex-col w-full mb-4">
            <input
              type="text"
              value={blockName}
              onChange={handleBlockNameChange}
              placeholder="Blok Adı"
              className="px-4 py-2 mb-2 border rounded shadow"
            />
            <input
              type="number"
              value={parkNumber}
              onChange={handleParkNumberChange}
              placeholder="Park Numarası"
              className="px-4 py-2 mb-2 border rounded shadow"
            />
            <button
              onClick={handleAddToBlock}
              disabled={points.length !== 4 || isSending}
              className={`px-4 py-2 rounded shadow-md text-white hover:bg-green-600 ${
                points.length === 4 ? "bg-green-500" : "bg-gray-300"
              } ${
                points.length !== 4
                  ? "disabled:opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isSending ? "Gönderiliyor..." : "Bloğa Ekle"}
            </button>
          </div>
          <div className="w-full overflow-y-auto">
            {parkingAreas.length === 0 ? (
              <div className="flex flex-col justify-center self-center p-10 mx-auto items-center h-full">
                <img
                  src={car}
                  alt="No parking areas illustration"
                  className="w-1/4"
                />
                <p className="text-slate-300 text-xl font-semibold mt-4">
                  Eskiden Buralar Hep Dutluktu..
                </p>
              </div>
            ) : (
              parkingAreas.flatMap((area) => {
                const coordinatesList = area.coordinatesList;
                const parkNumbers = coordinatesList
                  ? Object.keys(coordinatesList)
                  : [];
                return parkNumbers.map((parkNumber) => (
                  <div
                    key={`${area.id}-${parkNumber}`}
                    className="flex justify-between items-center py-2 px-4 border-b border-gray-200"
                  >
                    <div>
                      <span className="font-semibold bg-orange-300 hover:bg-orange-400  px-6 py-3 rounded-2xl ">
                        {area.blockName} BLOK / {parkNumber}. PARK YERİ
                      </span>
                    </div>
                    <button
                      className="text-red-500 bg-white px-6 rounded-2xl py-2 hover:text-red-700 hover:bg-orange-300 transition-all cursor-pointer border-orange-300 focus:outline-none "
                      onClick={() =>
                        deleteParkingArea(area.blockName, parkNumber)
                      }
                    >
                      Sil
                    </button>
                  </div>
                ));
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkYeriBelirle;
