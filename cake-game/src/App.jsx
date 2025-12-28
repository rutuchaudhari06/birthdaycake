import { useState } from "react";

import './App.css'
import unlitcake from './images/unlitcake.png'
import litcake from './images/litcake.png'
import match from './images/match.png'  
function App() {
  const [lit,setlit]=useState(false);
  const [pos,setpos]=useState({x:0,y:0});
  const cakeref = useRef(null);

  function handleMouseMove(event){
    const rect = e.currentTarget.getBoundingClientRect();

  setpos({
    x: e.clientX - rect.left -20,
    y: e.clientY - rect.top -5
  });
  
  }

  return (
    <div className="mainbody" onMouseMove={handleMouseMove} onClick={()=>setlit(true)} >
      <h1 className="birthdaytext">Happy birthday</h1>
      <img className="cake-image" src={unlitcake} alt={lit ? "lit cake" : "unlit cake"} />

      <img 
      src={match} 
      alt="match"   
      className={`matchstick ${lit ? "lit" : ""}`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`
      }}
      />
    </div>
  );
}

export default App;

