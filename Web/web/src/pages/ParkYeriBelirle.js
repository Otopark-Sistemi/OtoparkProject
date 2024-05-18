import React, { useRef, useEffect, useState } from "react";
import backgroundImage from "../img/bg2.jpeg"; // Background image

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

  // Function to update canvas dimensions on window resize
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

  // Function to handle undo and redo using keyboard shortcuts
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

  // Function to check if a point is inside a polygon
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

  // Function to add a point to the canvas
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

  // Function to handle undo operation
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack.pop();
      setRedoStack([...redoStack, points]);
      setPoints(previousState);
    }
  };

  // Function to handle redo operation
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      setUndoStack([...undoStack, points]);
      setPoints(nextState);
    }
  };

  // Function to handle canvas click event
  const handleCanvasClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    addPoint(x, y);
  };

  // Function to handle block name change
  const handleBlockNameChange = (event) => {
    setBlockName(event.target.value.toUpperCase());
  };

  // Function to handle park number change
  const handleParkNumberChange = (event) => {
    setParkNumber(event.target.value);
  };

  // Function to add points to a block
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
      const response = await fetch("http://192.168.35.167:8082/area/create", {
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

  // Function to fetch parking areas from backend
  const fetchParkingAreas = async () => {
    try {
      const response = await fetch("http://192.168.35.167:8082/area/getAll", {
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

  // Function to delete a parking area
  const deleteParkingArea = async (id) => {
    try {
      const response = await fetch(
        `http://192.168.35.167:8082/area/delete/${id}`,
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
      setParkingAreas(updatedParkingAreas); // State'ten silinen park alanını kaldır
    } catch (error) {
      console.error("Veri silinirken hata oluştu:", error);
      alert("Veri silinirken hata oluştu.");
    }
  };

  // Function to handle delete parking area button click
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

  // UseEffect to fetch parking areas when component mounts
  useEffect(() => {
    fetchParkingAreas();
  }, []);

  // UseEffect to draw on canvas when points or parkingAreas change
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

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div
        className="relative bg-contain bg-center w-4/5 h-4/5"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute bottom-14 left-2 space-x-2">
          <button onClick={handleUndo} className="px-2 py-1 bg-blue-300">
            Geri Al
          </button>
          <button onClick={handleRedo} className="px-2 py-1 bg-blue-300">
            İleri Al
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          onClick={handleCanvasClick}
          className="w-full h-full"
        ></canvas>

        <div className="absolute bottom-2 left-2 space-x-2">
          <input
            type="text"
            value={blockName}
            onChange={handleBlockNameChange}
            placeholder="Blok Adı"
            className="px-2 py-1 border"
          />
          <input
            type="number"
            value={parkNumber}
            onChange={handleParkNumberChange}
            placeholder="Park Numarası"
            className="px-2 py-1 border"
          />
          <button
            onClick={handleAddToBlock}
            disabled={points.length !== 4 || isSending}
            className={`px-2 py-1 ${
              points.length === 4 ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            {isSending ? "Gönderiliyor..." : "Bloğa Ekle"}
          </button>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        {parkingAreas.map((area, index) => (
          <div key={index} className="mb-4 p-2 bg-gray-100 rounded shadow-md">
            <h2 className="font-bold mb-2">{area.blockName} Blok</h2>
            <div className="mb-1">
              {area.blockName} Blok: {area.parkNumber}. Park Yeri
              <div className="text-sm text-gray-600">
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
              className="px-2 py-1 bg-red-500 text-white"
            >
              Sil
            </button>
          </div>
        ))}
        <div className="mt-4 p-2 bg-white rounded shadow-md">
          <h2 className="font-bold mb-2">Geçici Noktalar</h2>
          {points.map((point, index) => (
            <div key={index}>
              Nokta {index + 1}: ({point.x.toFixed(2)}, {point.y.toFixed(2)})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParkYeriBelirle;

