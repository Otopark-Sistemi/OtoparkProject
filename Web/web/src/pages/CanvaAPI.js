import React, { useRef, useEffect, useState } from "react";
import backgroundImage from "../img/bg.jpeg"; // Background image

const CanvasAPI = () => {
  const canvasRef = useRef(null);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [points, setPoints] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [blockName, setBlockName] = useState("");
  const [parkingAreas, setParkingAreas] = useState([]);
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

    points.forEach((point) => {
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      context.fillStyle = "red";
      context.fill();
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

  const handleAddParkingArea = () => {
    setIsPopupOpen(true);
  };

  const handleBlockNameChange = (event) => {
    setBlockName(event.target.value.toUpperCase());
  };

  const handlePopupSubmit = () => {
    if (blockName.length !== 1 || !/^[A-Z]$/.test(blockName)) {
      alert("Blok adı tek karakterli büyük harf olmalıdır.");
      return;
    }

    const newParkingArea = {
      blockName,
      coordinates: points,
      parkNumber:
        parkingAreas.filter((area) => area.blockName === blockName).length + 1,
    };

    // Örneğin Axios ile POST isteği atabilirsiniz:
    // axios.post('/your-backend-url', newParkingArea);

    setParkingAreas([...parkingAreas, newParkingArea]);
    setIsPopupOpen(false);
    setPoints([]);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div
        className="relative bg-cover bg-center w-4/5 h-4/5"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute top-2 left-2 space-x-2">
          <button onClick={handleUndo} className="px-2 py-1 bg-gray-300">
            Undo
          </button>
          <button onClick={handleRedo} className="px-2 py-1 bg-gray-300">
            Redo
          </button>
          <button
            disabled={points.length !== 4}
            onClick={handleAddParkingArea}
            className={`px-2 py-1 ${
              points.length === 4 ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            Park Yeri Ekle
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          onClick={handleCanvasClick}
          className="w-full h-full"
        ></canvas>

        {isPopupOpen && (
          <div className="popup absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="p-4 bg-white shadow-lg rounded">
              <input
                type="text"
                value={blockName}
                onChange={handleBlockNameChange}
                placeholder="Blok Adı"
                className="px-2 py-1 border"
              />
              <button
                onClick={handlePopupSubmit}
                className="ml-2 px-2 py-1 bg-green-500 text-white"
              >
                Gönder
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4">
        {parkingAreas.map((area, index) => (
          <div key={index}>
            {area.blockName} Blok: {area.parkNumber}. Park Yeri
          </div>
        ))}
      </div>
    </div>
  );
};

export default CanvasAPI;
