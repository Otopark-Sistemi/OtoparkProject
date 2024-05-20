import React, { useRef, useEffect, useState } from "react";
import backgroundImage from "../img/bg2.jpeg";
import server from "../img/server.svg";

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
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const addPoint = (x, y) => {
    for (const area of parkingAreas) {
      if (isPointInPolygon({ x, y }, area.coordinates)) {
        alert("Bu nokta başka bir park alanının içinde.");
        return;
      }
    }

    setUndoStack([...undoStack, points]);
    setRedoStack([]);
    setPoints([...points, { x, y }]);
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

    const newParkingArea = {
      blockName,
      parkNumber,
      coordinates: points,
    };

    setIsSending(true);

    try {
      const response = await fetch("http://192.168.209.210:8082/area/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newParkingArea),
      });

      if (!response.ok) {
        throw new Error("Veri gönderilemedi.");
      }

      console.log("Veri başarıyla gönderildi:", newParkingArea);

      setParkingAreas([...parkingAreas, newParkingArea]);
      setPoints([]);
      setBlockName("");
      setParkNumber("");
    } catch (error) {
      console.error("Veri gönderilirken hata oluştu:", error);
      alert("Veri gönderilirken hata oluştu.");
    } finally {
      setIsSending(false);
    }
  };

  const fetchParkingAreas = async () => {
    try {
      const response = await fetch("http://192.168.209.210:8082/area/getAll", {
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
      alert("Veri alınırken hata oluştu.");
    }
  };

  const deleteParkingArea = async (id) => {
    try {
      const response = await fetch(
        `http://192.168.209.210:8082/area/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Veri silinemedi.");
      }

      console.log("Veri başarıyla silindi:", id);

      const updatedParkingAreas = parkingAreas.filter((area) => area.id !== id);
      setParkingAreas(updatedParkingAreas);
    } catch (error) {
      console.error("Veri silinirken hata oluştu:", error);
      alert("Veri silinirken hata oluştu.");
    }
  };

  const handleDeleteParkingArea = (blockName, parkNumber) => {
    const areaToDelete = parkingAreas.find(
      (area) => area.blockName === blockName && area.parkNumber === parkNumber
    );

    if (!areaToDelete) {
      alert("Silinecek park alanı bulunamadı.");
      return;
    }

    deleteParkingArea(areaToDelete.id);
  };

  useEffect(() => {
    fetchParkingAreas();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach((point, index) => {
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      context.fillStyle = "red";
      context.fill();
      context.fillText(`${index + 1}. Nokta`, point.x + 5, point.y - 5);
    });

    if (points.length === 4) {
      const color = colors[parkingAreas.length % colors.length];
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      context.lineTo(points[1].x, points[1].y);
      context.lineTo(points[2].x, points[2].y);
      context.lineTo(points[3].x, points[3].y);
      context.closePath();
      context.strokeStyle = `rgba(${color}, 1)`;
      context.fillStyle = `rgba(${color}, 0.5)`;
      context.fill();
      context.stroke();
    }

    parkingAreas.forEach((area, index) => {
      const color = colors[index % colors.length];
      context.beginPath();
      context.moveTo(area.coordinates[0].x, area.coordinates[0].y);
      context.lineTo(area.coordinates[1].x, area.coordinates[1].y);
      context.lineTo(area.coordinates[2].x, area.coordinates[2].y);
      context.lineTo(area.coordinates[3].x, area.coordinates[3].y);
      context.closePath();
      context.strokeStyle = `rgba(${color}, 1)`;
      context.fillStyle = `rgba(${color}, 0.5)`;
      context.fill();
      context.stroke();
    });
  }, [points, parkingAreas]);

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
          {points.length > 0 && (
            <div className="w-full max-w-4xl mt-4 p-4 bg-white rounded shadow-md">
              <h2 className="font-bold text-lg mb-2">Geçici Noktalar</h2>
              {points.map((point, index) => (
                <div key={index}>
                  Nokta {index + 1}: ({point.x.toFixed(2)}, {point.y.toFixed(2)}
                  )
                </div>
              ))}
            </div>
          )}
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
              className={`px-4 py-2 ${
                points.length === 4 ? "bg-green-500" : "bg-gray-300"
              } text-white rounded shadow hover:bg-green-600 disabled:opacity-50`}
            >
              {isSending ? "Gönderiliyor..." : "Bloğa Ekle"}
            </button>
          </div>
          <div className="w-full overflow-y-auto">
            {parkingAreas.length === 0 ? (
              <div className="flex justify-center self-center p-10 ml-40  mx-auto items-center h-full">
                <img
                  src={server}
                  alt="No parking areas illustration"
                  className="w-3/4 "
                />
                <p className="text-gray-500 text-lg mt-4">
                  Eskiden Buralar Hep Dutluktu
                </p>
              </div>
            ) : (
              parkingAreas.map((area, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-4 p-4 bg-gray-200 rounded shadow-md"
                >
                  <div>
                    <h2 className="font-bold text-lg">{area.blockName} Blok</h2>
                    <p>
                      {area.blockName} Blok: {area.parkNumber}. Park Yeri
                    </p>
                    <div className="text-sm hidden text-gray-600">
                      {area.coordinates.map((point, index) => (
                        <div key={index}>
                          Nokta {index + 1}: ({point.x.toFixed(2)},{" "}
                          {point.y.toFixed(2)})
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleDeleteParkingArea(area.blockName, area.parkNumber)
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
                  >
                    Sil
                  </button>
                </div>
              ))
            )}
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default ParkYeriBelirle;

