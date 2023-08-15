import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./Colors.css";
import { SoundContextProvider } from "./Context/SoundContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  //<React.StrictMode>
    <SoundContextProvider>
      <App />
    </SoundContextProvider>
  //</React.StrictMode>
);
