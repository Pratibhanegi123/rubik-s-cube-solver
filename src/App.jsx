import React, { useState } from "react";
import Cube from "./components/Cube";
import ColorPicker from "./components/ColorPicker";
import SolutionPanel from "./components/SolutionPanel";
import "./App.css";

function App() {
  const [selectedColor, setSelectedColor] = useState("white");

  return (
    <div className="container">
      <header>Rubik's Cube Solver</header>

      <div className="main">
        <div className="left-panel">
          <ColorPicker setSelectedColor={setSelectedColor} />
        </div>

        <div className="cube-view">
          <Cube selectedColor={selectedColor} />
        </div>

        <div className="right-panel">
          <SolutionPanel />
        </div>
      </div>

      <div className="bottom-panel">
        Moves will appear here
      </div>
    </div>
  );
}

export default App;