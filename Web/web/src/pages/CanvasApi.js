import React, { useRef, useEffect, useState } from "react";
import backgroundImage from "../img/bg.jpeg"; // Arka plan resmi

function Canvas() {
  const canvasRef = useRef(null);
  const [clickedPoints, setClickedPoints] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Arka plan resmini çizin
    const background = new Image();
    background.src = backgroundImage;
    background.onload = () => {
      // Canvas'ı ve arka plan resmini kendi boyutlarına göre ölçekleyin
      canvas.width = background.width;
      canvas.height = background.height;
      context.drawImage(background, 0, 0);
    };

    // Tıklama olayını dinlemek için bir event listener ekleyin
    canvas.addEventListener("click", handleCanvasClick);

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, []); // Boş bağımlılık dizisi, sadece bir kere çalışmasını sağlar

  const handleCanvasClick = (event) => {
    // Tıklama olayı gerçekleştiğinde burası çalışır
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Tıklanan noktanın koordinatlarını clickedPoints state'ine ekleyin
    setClickedPoints([...clickedPoints, { x, y }]);
  };

  // Tıklanan noktaları ekrana yazdırma
  const renderClickedPoints = () => {
    return clickedPoints.map((point, index) => (
      <div key={index}>
        Nokta {index + 1}: x={point.x}, y={point.y}
      </div>
    ));
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />
      {renderClickedPoints()}
    </div>
  );
}

function CanvasApi() {
  return (
    <div className="h-screen w-screen p-40 bg-slate-400 justify-center items-center ">
      <div className="w-[80rem]">
        <h1 className="text-3xl ">Tıklanılan Noktaların Koordinatları</h1>
        <Canvas />
      </div>
    </div>
  );
}

export default CanvasApi;
