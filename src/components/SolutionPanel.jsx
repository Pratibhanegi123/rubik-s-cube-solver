import React, { useState } from "react";

function SolutionPanel() {
  const [solution, setSolution] = useState("");

  const handleSolve = () => {
    fetch("http://localhost:5000/api/solver/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cube: "sample_cube_state" // 🔁 replace with real cube data later
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setSolution(data.solution || JSON.stringify(data));
      })
      .catch(err => {
        console.error(err);
        setSolution("Error connecting to backend");
      });
  };

  return (
    <div>
      <h3>Solution</h3>
      <button onClick={handleSolve}>Solve</button>

      <p>{solution}</p>
    </div>
  );
}

export default SolutionPanel;