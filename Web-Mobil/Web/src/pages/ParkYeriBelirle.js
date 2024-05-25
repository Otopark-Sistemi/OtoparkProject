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
  const [parkingAreas, setParkingAreas] = useState([]); // Initialize as an empty array
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
    const { a, b } = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const ai = polygon[i].a,
        bi = polygon[i].b;
      const aj = polygon[j].a,
        bj = polygon[j].b;

      const intersect =
        bi > b !== bj > b && a < ((aj - ai) * (b - bi)) / (bj - bi) + ai;
      if (intersect) inside = !inside;
    }
    return inside;
  };

const addPoint = (x, y) => {
  for (const area of parkingAreas) {
    if (
      isPointInPolygon(
        { x, y },
        area.coordinatesList[Object.keys(area.coordinatesList)[0]]
      )
    ) {
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
    const a = event.clientX - rect.left;
    const b = event.clientY - rect.top;
    addPoint(a, b);
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
      const response = await fetch("http://192.168.35.233:8082/area/create", {
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
      const response = await fetch("http://192.168.35.233:8082/area/getAll", {
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
        `http://192.168.35.84:8082/area/delete/${id}`,
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

    parkingAreas.forEach((area) => {
      const color = colors[parkingAreas.indexOf(area) % colors.length];
      const coordinates =
        area.coordinatesList[Object.keys(area.coordinatesList)[0]];

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
      context.fillStyle = "black";
      context.fillText(
        `Blok: ${area.blockName} Park No: ${area.parkNumber}`,
        coordinates[0].x + 10,
        coordinates[0].y + 10
      );
    });
  }, [points, canvasDimensions, parkingAreas]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="absolute top-0 left-0 m-4 p-4 bg-white bg-opacity-50 rounded-md shadow-lg">
        <img src={server} alt="Server" className="h-16 w-auto" />
      </div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white">Park Yeri Belirleme</h1>
      </div>
      <div className="relative w-full max-w-4xl h-96 bg-white bg-opacity-75 shadow-lg rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          onClick={handleCanvasClick}
          className="border border-gray-300"
        />
        <div className="flex mt-4 justify-between">
          <div>
            <input
              type="text"
              placeholder="Blok Adı"
              value={blockName}
              onChange={handleBlockNameChange}
              className="mr-2 px-4 py-2 border border-gray-400 rounded-lg"
            />
            <input
              type="text"
              placeholder="Park Numarası"
              value={parkNumber}
              onChange={handleParkNumberChange}
              className="mr-2 px-4 py-2 border border-gray-400 rounded-lg"
            />
            <button
              onClick={handleAddToBlock}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              disabled={isSending}
            >
              Park Alanı Ekle
            </button>
          </div>
          <button
            onClick={handleUndo}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
          >
            Geri Al
          </button>
          <button
            onClick={handleRedo}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Yinele
          </button>
        </div>
      </div>
      <div className="w-full max-w-4xl mt-8 bg-white bg-opacity-75 shadow-lg rounded-lg p-4">
        <h2 className="text-2xl font-bold mb-4">Park Alanları</h2>
        <ul>
          {parkingAreas.length > 0 &&
            parkingAreas.map((area) => (
              <li
                key={area.id}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  Blok: {area.blockName}, Park Numarası:{" "}
                  {Object.keys(area.coordinatesList)[0]}
                </span>
                <button
                  onClick={() =>
                    handleDeleteParkingArea(
                      area.blockName,
                      Object.keys(area.coordinatesList)[0]
                    )
                  }
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Sil
                </button>
              </li>
            ))}
          {parkingAreas.length === 0 && <li>Henüz park alanı eklenmedi.</li>}
        </ul>
      </div>
    </div>
  );
};

export default ParkYeriBelirle;
