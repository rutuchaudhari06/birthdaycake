import { useState, useRef } from "react";
import "./App.css";

import unlitCake from "./images/unlitcake.png";
import litCake from "./images/litcake.png";
import matchstickImg from "./images/match.png";

function App() {
  // position of the matchstick
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // is the cake lit?
  const [isLit, setIsLit] = useState(false);

  // reference to the cake DOM element
  const cakeRef = useRef(null);

  function handleMouseMove(e) {
    // get mainbody position relative to viewport
    const rect = e.currentTarget.getBoundingClientRect();

    // mouse position relative to mainbody
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // adjust so matchstick tip aligns with cursor
    setPos({
      x: x - 20, // half matchstick width
      y: y - 5   // near the tip
    });

    // --- proximity detection ---
    const cakeRect = cakeRef.current.getBoundingClientRect();

    const cakeCenterX = cakeRect.left + cakeRect.width / 2;
    const cakeCenterY = cakeRect.top + cakeRect.height / 2;

    const dx = e.clientX - cakeCenterX;
    const dy = e.clientY - cakeCenterY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    // threshold for lighting the cake
    if (distance < 80) {
      setIsLit(true);
    } 
  }

  return (
    <div className="mainbody" onMouseMove={handleMouseMove}>
      <h1 className="birthdaytext">Happy Birthday</h1>

      {/* Cake */}
      <img
        ref={cakeRef}
        className={`cake-image ${isLit ? "cake-lit" : "cake-unlit"}`}
        src={isLit ? litCake : unlitCake}
        alt="cake"
      />

      {/* Matchstick cursor */}
      <img
        className={`matchstick ${isLit ? "lit" : ""}`}
        src={matchstickImg}
        alt="matchstick"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`
        }}
      />
    </div>
  );
}

export default App;
