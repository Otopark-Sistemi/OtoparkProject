import React, { useRef, useEffect, useState } from "react";
import backgroundImage from "../img/bg.jpeg"; // Arka plan resmi

function Canvas() {
  const canvasRef = useRef(null);
  const [clickedPoints, setClickedPoints] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [colorIndex, setColorIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  const colors = ["red", "blue", "green", "yellow"]; // Farklı renkler

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

  const redrawPolygons = (context) => {
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

  const handleCanvasClick = (event) => {
    if (clickedPoints.length >= 4) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const newPoint = { x, y };
    setHistory((prevHistory) => [...prevHistory, clickedPoints]);
    setClickedPoints((prevPoints) => [...prevPoints, newPoint]);
    setRedoHistory([]); // Clear redo history on new action
  };

  const handleSend = () => {
    if (clickedPoints.length === 4) {
      setPolygons((prevPolygons) => [
        ...prevPolygons,
        {
          points: clickedPoints,
          color: colors[colorIndex],
          regionName: `Bölge ${prevPolygons.length + 1}`,
        },
      ]);
      setClickedPoints([]);
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    } else {
      alert("Lütfen 4 nokta seçin.");
    }
  };

  const drawPolygon = (points, color, context) => {
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.closePath();
    context.stroke();
  };

  const handleRemovePoint = (index) => {
    setHistory((prevHistory) => [...prevHistory, clickedPoints]);
    setClickedPoints((prevPoints) => prevPoints.filter((_, i) => i !== index));
    setRedoHistory([]); // Clear redo history on new action
  };

  const handleUndo = () => {
    if (clickedPoints.length > 0) {
      setRedoHistory((prevRedoHistory) => [...prevRedoHistory, clickedPoints]);
      setClickedPoints(history.pop());
      setHistory((prevHistory) => prevHistory.slice(0, -1));
    } else if (polygons.length > 0) {
      const lastPolygon = polygons.pop();
      setRedoHistory((prevRedoHistory) => [...prevRedoHistory, clickedPoints]);
      setClickedPoints(lastPolygon.points);
      setColorIndex(colors.indexOf(lastPolygon.color));
      setPolygons((prevPolygons) => prevPolygons.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoHistory.length > 0) {
      const lastRedo = redoHistory.pop();
      setHistory((prevHistory) => [...prevHistory, clickedPoints]);
      setClickedPoints(lastRedo);
      setRedoHistory((prevRedoHistory) => prevRedoHistory.slice(0, -1));
    }
  };

  const handleRemoveRegion = (index) => {
    setPolygons(polygons.filter((_, i) => i !== index));
  };

  const renderClickedPoints = () => {
    const canvas = canvasRef.current;
    const context = canvas ? canvas.getContext("2d") : null;

    if (context) {
      const background = new Image();
      background.src = backgroundImage;
      background.onload = () => {
        context.drawImage(background, 0, 0);
        redrawPolygons(context);
      };
    }

    return clickedPoints.map((point, index) => (
      <div
        className="text-xl w-48 flex mx-auto p-4 bg-teal-500 opacity-80"
        key={index}
        style={{ display: "flex", alignItems: "center" }}
      >
        {index + 1}. nokta seçildi
        <button
          onClick={() => handleRemovePoint(index)}
          style={{ marginLeft: "10px", color: "red" }}
        >
          Sil
        </button>
      </div>
    ));
  };

  const renderPolygons = () => {
    return polygons.map((polygon, index) => (
      <div key={index} className="region-info p-3 bg-slate-400 justify-center items-center flex flex-wrap gap-2">
        <h2 className="text-center text-xl ">{polygon.regionName} belirlendi</h2>
        <ul className="hidden ">
          {polygon.points.map((point, idx) => (
            <li key={idx}>
              x: {point.x}, y: {point.y}
            </li>
          ))}
        </ul>
        <button className="bg-red-500 px-3" onClick={() => handleRemoveRegion(index)}>Sil</button>
      </div>
    ));
  };

  return (
    <div className="bg-pink-200 p-1 flex flex-row rounded-xl ">
      <div className="bg-blue-200 p-1 w-[80%]">
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />

        <button
          onClick={handleSend}
          style={{
            marginTop: "10px",
            color: "white",
            backgroundColor: clickedPoints.length === 4 ? "blue" : "gray",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "18px",
            cursor: clickedPoints.length === 4 ? "pointer" : "not-allowed",
          }}
          disabled={clickedPoints.length !== 4}
        >
          Gönder
        </button>
      </div>

      <div className="regions-info">
        {renderPolygons()}
        {renderClickedPoints()}
      </div>
    </div>
  );
}

function CanvasApi() {
  return (
    <div className="h-screen flex flex-col bg-slate-400 justify-evenly items-center">
      <div className="p-1 rounded-xl">
        <h1 className="text-3xl text-center">
          Tıklanılan Noktaların Koordinatları
        </h1>
      </div>
      <div className="h-[40rem] w-3/4 bg-slate-50 rounded-xl">
        <Canvas />
      </div>
    </div>
  );
}

export default CanvasApi;
