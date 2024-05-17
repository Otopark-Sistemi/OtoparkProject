import React, { useEffect, useRef, useState } from "react";
import backgroundImage from "../img/bg.jpeg"; // Background image

const CanvaAPI = () => {
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
  const [isSending, setIsSending] = useState(false); // State to track if data is being sent to backend
  const colors = [
    "255, 0, 0",
    "0, 255, 0",
    "0, 0, 255",
    "255, 165, 0",
    "128, 0, 128",
  ]; // RGB colors

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

    return () => window.removeEventListener("resize", updateCanvasDimensions);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach((point, index) => {
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      context.fillStyle = "red";
      context.fill();
      context.fillText(`${index + 1}. Nokta`, point.x + 5, point.y - 5); // Display point number
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
      const response = await fetch("http://192.168.35.297:8082/area/create", {
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
      const response = await fetch("http://192.168.35.297:8082/area/all", {
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

      setParkingAreas(data); // Backendden gelen veriyi state'e set et
    } catch (error) {
      console.error("Veri alınırken hata oluştu:", error);
      alert("Veri alınırken hata oluştu.");
    }
  };

  const deleteParkingAreaById = async (id) => {
    try {
      const response = await fetch(`http://192.168.35.297:8082/area/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Veri silinemedi.");
      }

      console.log("Veri başarıyla silindi:", id);

      const updatedParkingAreas = parkingAreas.filter((area) => area.id !== id);
      setParkingAreas(updatedParkingAreas); // State'ten silinen park alanını kaldır
    } catch (error) {
      console.error("Veri silinirken hata oluştu:", error);
      alert("Veri silinirken hata oluştu.");
    }
  };

  const handleDeleteParkingArea = (blockName, parkNumber) => {
    const areaToDelete = parkingAreas.find(
      (area) => area.blockName === blockName && area.parkNumber === parkNumber
    );

    if (areaToDelete) {
      deleteParkingAreaById(areaToDelete.id);
    } else {
      alert("Silmek istediğiniz park alanı bulunamadı.");
    }
  };

  useEffect(() => {
    fetchParkingAreas();
  }, []);

    <div className="flex items-center justify-center h-screen">
      <div className="relative">
        <img
          ref={canvasRef}
          src={backgroundImage}
          alt="Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onClick={handleCanvasClick}
        />
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            cursor: "pointer",
          }}
          onClick={handleCanvasClick}
        />
        <div className="absolute top-0 left-0 p-4">
          <h2 className="text-xl font-semibold mb-2">Park Alanı Ekle</h2>
          <div className="flex space-x-4 mb-2">
            <input
              type="text"
              placeholder="Blok Adı"
              value={blockName}
              onChange={handleBlockNameChange}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Park Numarası"
              value={parkNumber}
              onChange={handleParkNumberChange}
              className="p-2 border border-gray-300 rounded"
            />
            <button
              className="p-2 bg-blue-500 text-white rounded"
              onClick={handleAddToBlock}
              disabled={isSending}
            >
              {isSending ? "Ekleniyor..." : "Ekle"}
            </button>
          </div>
          <button
            className="p-2 bg-red-500 text-white rounded"
            onClick={() => handleDeleteParkingArea(blockName, parkNumber)}
          >
            Park Alanı Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvaAPI;
