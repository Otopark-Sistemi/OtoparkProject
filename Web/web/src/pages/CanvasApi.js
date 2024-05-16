import React, { useRef, useEffect, useState } from "react";
import backgroundImage from "../img/bg.jpeg"; // Background image

function CanvasApi() {
  const canvasRef = useRef(null);
  const [clickedPoints, setClickedPoints] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [colorIndex, setColorIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [completed, setCompleted] = useState(false); // Completion status
  const [parkArea, setParkArea] = useState("");
  const [areaNameInput, setAreaNameInput] = useState("");
  const [sentPolygons, setSentPolygons] = useState([]); // Sent polygons

  const colors = ["red", "blue", "green", "yellow"]; // Different colors

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const background = new Image();
    background.src = backgroundImage;
    background.onload = () => {
      canvas.width = background.width;
      canvas.height = background.height;
      context.drawImage(background, 0, 0);
      redrawPolygons(context);
    };

    const handleCanvasClick = (event) => {
      if (clickedPoints.length >= 4 || isPointOverlapping(event)) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      // Tıklanan noktanın belirlenen alanın içinde olup olmadığını kontrol et
      const isInsidePolygon = polygons.some((polygon) =>
        isPointInsidePolygon({ x, y }, polygon.points)
      );

      // Eğer tıklanan nokta belirlenen alanın içindeyse, hata mesajı göster ve işlemi sonlandır
      if (isInsidePolygon) {
        alert("Lütfen seçilen alan dışında bir nokta belirleyiniz.");
        return;
      }

      // Belirlenen alanda tıklama yapıldığında, yeni bir nokta eklemek yerine hata mesajı göster
      if (clickedPoints.length >= 4) {
        alert("Belirlenen alan içerisine tekrardan işaretleme yapılamaz.");
        return;
      }

      // Yeni noktayı tıklama listesine ekle
      const newPoint = { x, y };
      setHistory((prev) => [
        ...prev,
        { points: [...clickedPoints], polygons: [...polygons] },
      ]);
      setRedoHistory([]);
      setClickedPoints((prev) => [...prev, newPoint]);
    };

    canvas.addEventListener("click", handleCanvasClick);

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [polygons, clickedPoints]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "z") {
        handleUndo();
      }
      if (event.ctrlKey && event.key === "y") {
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [history, redoHistory]);

  useEffect(() => {
    // If all parking areas are added, set the completion status to true
    if (polygons.length > 0) {
      setCompleted(true);
    } else {
      setCompleted(false);
    }
  }, [polygons]);

  const redrawPolygons = (context) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const background = new Image();
    background.src = backgroundImage;
    background.onload = () => {
      context.drawImage(background, 0, 0);
      polygons.forEach((polygon) => {
        drawPolygon(polygon.points, polygon.color, context);
      });
      clickedPoints.forEach((point) => {
        context.fillStyle = "red";
        context.beginPath();
        context.arc(point.x, point.y, 5, 0, Math.PI * 2);
        context.fill();
      });
    };
  };

  const handleSend = () => {
    if (clickedPoints.length === 4 && areaNameInput !== "") {
      const newPolygon = {
        points: clickedPoints,
        color: colors[colorIndex],
        regionName: areaNameInput,
      };

      // Kontrol et: Yeni polygon, daha önce gönderilmiş bir polygon ile aynı mı?
      const isDuplicate = sentPolygons.some((polygon) =>
        polygon.points.every(
          (point, index) =>
            point.x === newPolygon.points[index].x &&
            point.y === newPolygon.points[index].y
        )
      );

      if (isDuplicate) {
        alert("Bu park alanı zaten gönderildi.");
        return;
      }

      setPolygons((prev) => [...prev, newPolygon]);
      setClickedPoints([]);
      setColorIndex((prev) => (prev + 1) % colors.length);
      setHistory((prev) => [
        ...prev,
        { points: [], polygons: [...polygons, newPolygon] },
      ]);
      setRedoHistory([]);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setRedoHistory((prev) => [
        ...prev,
        { points: [...clickedPoints], polygons: [...polygons] },
      ]);
      setClickedPoints(previousState.points);
      setPolygons(previousState.polygons);
    }
  };

  const handleRedo = () => {
    if (redoHistory.length > 0) {
      const nextState = redoHistory[redoHistory.length - 1];
      setRedoHistory((prev) => prev.slice(0, -1));
      setHistory((prev) => [
        ...prev,
        { points: [...clickedPoints], polygons: [...polygons] },
      ]);
      setClickedPoints(nextState.points);
      setPolygons(nextState.polygons);
    }
  };

  const handleRemoveRegion = (index) => {
    setPolygons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemovePoint = (index) => {
    setClickedPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const isPointOverlapping = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    return clickedPoints.some(
      (point) => Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2) < 10
    );
  };

  const isPointInsidePolygon = (point, polygonPoints) => {
    let inside = false;
    for (
      let i = 0, j = polygonPoints.length - 1;
      i < polygonPoints.length;
      j = i++
    ) {
      const xi = polygonPoints[i].x;
      const yi = polygonPoints[i].y;
      const xj = polygonPoints[j].x;
      const yj = polygonPoints[j].y;
      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const drawPolygon = (points, color, context) => {
    if (points.length === 0) return;

    context.strokeStyle = color;
    context.fillStyle = "rgba(255, 0, 0, 0.2)";
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    points.forEach((point) => context.lineTo(point.x, point.y));
    context.closePath();
    context.fill();
    context.stroke();
  };

const sendParkAreaToBackend = () => {
  const parkAreaJSON = {
    blockName: "A", // Block name
    parkNumber: "1", // Park number
    coordinates: clickedPoints.map((point) => ({ x: point.x, y: point.y })), // Convert clickedPoints to the desired format
  };

  console.log("Gönderilecek veri:", parkAreaJSON); // Veriyi konsola yazdır

  fetch("http://192.168.35.48:8082/area/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parkAreaJSON),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // Backend'den gelen yanıtı kontrol et
      // Başarıyla gönderilen polygonları kaydet
      setSentPolygons((prev) => [...prev, ...polygons]);
      // Polygons ve clickedPoints state'lerini sıfırla
      setPolygons([]);
      setClickedPoints([]);
      setParkArea("");
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
};


  const checkAreaOverlap = (newAreaPoints, newAreaBlock) => {
    polygons.forEach((polygon) => {
      const existingAreaPoints = polygon.points;
      newAreaPoints.forEach((newPoint) => {
        if (isPointInsidePolygon(newPoint, existingAreaPoints)) {
          alert(
            `Bu alan ${polygon.regionName} bloğunda yer alıyor, önce oradan kaldırın.`
          );
          return;
        }
      });
    });
  };

  const handleEditArea = (areaName) => {
    const selectedArea = polygons.find((area) => area.regionName === areaName);
    if (!selectedArea) {
      console.error("Seçilen park alanı bulunamadı.");
      return;
    }
    console.log("Seçilen Park Alanı:", selectedArea);
  };

  const sendDataToBackend = () => {
    const parkYerleriJSON = polygons.map((polygon, index) => {
      const parkYeriNoktalari = polygon.points.map((point, idx) => {
        return {
          [`${idx + 1}.Nokta`]: { x: point.x, y: point.y },
        };
      });
      return {
        [`ParkYeri${index + 1}`]: parkYeriNoktalari,
      };
    });

    fetch("BACKEND_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parkYerleriJSON),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const renderPolygons = () => {
    return polygons.map((polygon, index) => (
      <div
        key={index}
        className="region-info p-3 bg-slate-400 justify-center items-center flex flex-wrap gap-2"
      >
        <div className="bg-emerald-600 border-[1px] border-white p-2 ">
          <h2 className="text-center text-white text-xl ">
            {polygon.regionName} belirlendi
          </h2>
        </div>
        <ul className="hidden ">
          {polygon.points.map((point, idx) => (
            <li key={idx}>
              x: {point.x}, y: {point.y}
            </li>
          ))}
        </ul>
        <button
          className="bg-red-500 px-3 rounded-md text-white text-xl border-[1px] border-white hover:border-black hover:text-black hover:border-500 hover:bg-white transition-all duration-300"
          onClick={() => handleRemoveRegion(index)}
        >
          Sil
        </button>
      </div>
    ));
  };

  const renderClickedPoints = () => {
    return clickedPoints.map((point, index) => (
      <div
        className="text-xl w-56 m-2 flex justify-between mx-auto border-b-2 p-4 text-white bg-teal-500 "
        key={index}
      >
        {index + 1}. nokta seçildi
        <button
          onClick={() => handleRemovePoint(index)}
          className="bg-red-500 px-3 rounded-md text-white text-xl border-[1px] border-white hover:border-black hover:text-black hover:border-500 hover:bg-white transition-all duration-300"
        >
          Sil
        </button>
      </div>
    ));
  };

  const handleAddPolygon = () => {
    if (clickedPoints.length === 4) {
      const areaName = prompt("Lütfen park alanı adı giriniz (A, B, C...):");
      if (areaName) {
        setParkArea(areaName);
        handleSend();
      }
    }
  };

  return (
    <div className="p-1 flex flex-row rounded-xl">
      <div className="p-1 w-[80%]">
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />

        <button
          onClick={handleAddPolygon}
          className="transition-all duration-300 mt-5 font-bold py-2 px-4 rounded"
          style={{
            background: clickedPoints.length === 4 ? "blue" : "white",
            color: clickedPoints.length === 4 ? "white" : "blue",
            cursor: clickedPoints.length === 4 ? "pointer" : "not-allowed",
          }}
          disabled={clickedPoints.length !== 4}
        >
          Park Yeri Ekle
        </button>
        <button
          onClick={sendParkAreaToBackend}
          className="transition-all duration-300 mt-5 ml-4 font-bold py-2 px-4 rounded"
          style={{
            background: parkArea !== "" ? "green" : "white",
            color: parkArea !== "" ? "white" : "green",
            cursor: parkArea !== "" ? "pointer" : "not-allowed",
          }}
          disabled={parkArea === ""}
        >
          {`Park Alanı ${parkArea} Gönder`}
        </button>
      </div>

      <div className="ml-6 ">
        {renderPolygons()}
        {renderClickedPoints()}
      </div>
    </div>
  );
}

export default CanvasApi;

