import React, { useState, useEffect } from "react";

export const ParkingLotSetup = () => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    setBlocks([
      {
        name: "A",
        capacity: 5,
        parkingSpaces: [
          {
            id: 1,
            filled: true,
            plate: "34 ABC 56",
            entryTime: new Date("2024-05-10T12:34"),
          },
          { id: 2, filled: false },
          {
            id: 3,
            filled: true,
            plate: "78 XYZ 90",
            entryTime: new Date("2024-05-10T10:45"),
          },
          { id: 4, filled: false },
          {
            id: 5,
            filled: true,
            plate: "12 DEF 34",
            entryTime: new Date("2024-05-10T08:20"),
          },
        ],
      },
      {
        name: "B",
        capacity: 8,
        parkingSpaces: [
          { id: 1, filled: false },
          {
            id: 2,
            filled: true,
            plate: "56 GHI 78",
            entryTime: new Date("2024-05-10T09:15"),
          },
          {
            id: 3,
            filled: true,
            plate: "90 JKL 12",
            entryTime: new Date("2024-05-10T07:30"),
          },
          { id: 4, filled: false },
          {
            id: 5,
            filled: true,
            plate: "34 MNO 56",
            entryTime: new Date("2024-05-10T13:45"),
          },
          { id: 6, filled: false },
          { id: 7, filled: false },
          {
            id: 8,
            filled: true,
            plate: "78 PQR 90",
            entryTime: new Date("2024-05-10T11:20"),
          },
        ],
      },
      // Diğer blokların bilgileri buraya eklenecek...
    ]);
  }, []);

  const handleSpaceHover = (blockIndex, spaceId) => {
    const block = blocks[blockIndex];
    const space = block.parkingSpaces.find((space) => space.id === spaceId);
    if (space) {
      if (space.filled) {
        const entryTime = space.entryTime;
        const currentTime = new Date();
        const diffMs = currentTime - entryTime;
        const diffHours = Math.floor(diffMs / 1000 / 60 / 60);
        return (
          <div>
            <div>Plaka:</div>
            <div>{space.plate}</div>
            <div>Süre:</div>
            <div>{diffHours} saat</div>
          </div>
        );
      } else {
        return "Bu park yeri boş.";
      }
    }
    return "";
  };

  return (
    <>
      <div className="flex flex-col justify-center h-screen items-center">
        <div className="flex flex-col justify-center  p-10 rounded-3xl shadow-2xl items-center">
          <div>
            {" "}
            <h1 className="mb-40 text-5xl">Otopark</h1>
          </div>
          <div className="bg-green justify-center items-center mx-auto ">
            {blocks.map((block, blockIndex) => (
              <div
                key={`block-${blockIndex}`}
                className="mb-4 justify-start items-center flex flex-row gap gap-2"
              >
                <div className="text-center h-20 w-40"> 
                  <h3 className="bg-slate-300 text-center text-lg font-bold p-6  rounded-full">
                    Blok {block.name}
                  </h3>
                </div>

                <div className="bg-slate-50 flex  flex-wrap  p-2 overflow-auto">
                  {block.parkingSpaces.map((space) => (
                    <div
                      key={`block-${blockIndex}-parking-space-${space.id}`}
                      className={`border h-40 w-24 flex justify-center items-center rounded-md m-1 relative ${
                        space.filled
                          ? "bg-red-200 border-red-400"
                          : "bg-green-200 border-green-400"
                      }`}
                    >
                      <div className="space-info absolute bottom-8 left-0 right-0 bg-white text-lg text-center hover:opacity-100 transition-opacity duration-300 opacity-0">
                        {handleSpaceHover(blockIndex, space.id)}
                      </div>
                      {space.id}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
