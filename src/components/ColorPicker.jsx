import React, { useState } from "react";

const colors = ["white", "yellow", "red", "orange", "green", "blue"];

function ColorPicker({ setSelectedColor }) {
  const [active, setActive] = useState("white");

  const handleClick = (color) => {
    setActive(color);
    setSelectedColor(color);
  };

  return (
    <div>
      <h3>Manual Input</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => handleClick(color)}
            style={{
              width: "30px",
              height: "30px",
              background: color,
              border: active === color ? "3px solid white" : "1px solid gray",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ColorPicker;