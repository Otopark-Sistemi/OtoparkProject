import React, { useState } from "react";

const ParkingLotSetup = () => {
  const [clickedPoints, setClickedPoints] = useState([]);

  const handlePageClick = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const newPoint = { x, y };
    setClickedPoints([...clickedPoints, newPoint]);
  };

  return (
    <div
      style={{ width: "100vw", height: "100vh", position: "relative" }}
      onClick={handlePageClick}
    >
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
      >
        {clickedPoints.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={5} fill="red" />
        ))}
      </svg>
    </div>
  );
};

export default ParkingLotSetup;
