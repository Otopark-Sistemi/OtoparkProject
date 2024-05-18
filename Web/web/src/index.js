import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// HTML belgesine eklemeniz gereken Google Fonts bağlantısı
const link = document.createElement("link");
link.rel = "preconnect";
link.href = "https://fonts.googleapis.com";
document.head.appendChild(link);

const link2 = document.createElement("link");
link2.rel = "preconnect";
link2.href = "https://fonts.gstatic.com";
link2.crossOrigin = "anonymous";
document.head.appendChild(link2);

const link3 = document.createElement("link");
link3.href =
  "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap";
link3.rel = "stylesheet";
document.head.appendChild(link3);
