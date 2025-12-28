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
  const containerRef = useRef(null)

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const blowCooldownRef = useRef(false);
  const isLitRef = useRef(false);


  useEffect(() => {
    if (!videoRef.current) return;
    isLitRef.current = isLit;
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

      const tip = results.multiHandLandmarks[0][8];

      const containerRect = containerRef.current.getBoundingClientRect();

      const x = (1 - tip.x) * containerRect.width - 20;
      const y = tip.y * containerRect.height - 5;

      setPos({ x, y });

      // 🔥 HERE is where cakeRef is used
      const cakeRect = cakeRef.current.getBoundingClientRect();

      const tipX = containerRect.left + x + 20;
      const tipY = containerRect.top + y + 5;

      const cakeCenterX = cakeRect.left + cakeRect.width / 2;
      const cakeCenterY = cakeRect.top + cakeRect.height / 2;

      const dx = tipX - cakeCenterX;
      const dy = tipY - cakeCenterY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 80) {
        setIsLit(true);
      }
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
      async function setupMic() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 2048;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    detectBlow();
  }

  setupMic();
    return () => {
      camera.stop();
    };
      
  }, [isLit]);


  function detectBlow() {
  if (!analyserRef.current) return;

  analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

  let sum = 0;
  for (let i = 0; i < dataArrayRef.current.length; i++) {
    const v = (dataArrayRef.current[i] - 128) / 128;
    sum += v * v;
  }

  const rms = Math.sqrt(sum / dataArrayRef.current.length);
console.log("RMS:", rms);

  // 🔥 blow threshold (tune if needed)
  if (rms > 0.025 && isLitRef.current && !blowCooldownRef.current) {
  setIsLit(false);
  blowCooldownRef.current = true;

  setTimeout(() => {
    blowCooldownRef.current = false;
  }, 1000);
}


  requestAnimationFrame(detectBlow);
}

  return (
    <div
  className="mainbody"
  ref={containerRef}
  onClick={() => {
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }
  }}
>


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
