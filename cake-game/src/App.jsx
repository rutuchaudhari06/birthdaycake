import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import "./App.css";

import unlitCake from "./images/unlitcake.png";
import litCake from "./images/litcake.png";
import matchstickImg from "./images/match.png";


function App() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isLit, setIsLit] = useState(false);
  const cakeRef = useRef(null);

  const videoRef = useRef(null);   // webcam video
  const handsRef = useRef(null);   // mediapipe instance
  const cameraRef = useRef(null);  // camera controller
  const containerRef=useRef(null);
  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      if (!results.multiHandLandmarks) return;

      const indexFingerTip = results.multiHandLandmarks[0][8];

      // normalized (0 → 1)
      const handX = indexFingerTip.x;
const handY = indexFingerTip.y;

setPos({
  x: (1 - handX) * window.innerWidth - 20,
  y: handY * window.innerHeight - 20
});

    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    handsRef.current = hands;
    cameraRef.current = camera;

    return () => {
      camera.stop();
    };
  const cakeRect = cakeRef.current.getBoundingClientRect();

    const cakeCenterX = cakeRect.left + cakeRect.width / 2;
    const cakeCenterY = cakeRect.top + cakeRect.height / 2;

    const dx = e.clientX - cakeCenterX;
    const dy = e.clientY - cakeCenterY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 80) {
      setIsLit(true);
    }
  }, []);

  return (
    <div className="mainbody" ref={containerRef}>

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
        src={matchstickImg}
        className="matchstick"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`
        }}
        alt=""
      />
      <video
        ref={videoRef}
        className="camera-view"
        playsInline
        muted
      />

    </div>
  );
}

export default App;
