import React, { useState } from "react";
import './Tabs.scss';
import { Home } from "../pages/Home";
import { Resume } from "../pages/Resume";
import { CoolStuff } from "../pages/CoolStuff";
import { Contact } from "../pages/Contact";
import { Photography } from "../pages/Photography";

const SineWave = () => {
  const width = 3440; // Adjust this to match your ultrawide screen width
  const height = 100;
  const pathData = [];

  for (let x = 0; x < width; x++) {
    const y = ((Math.sin((x + 2) * 0.1) + 1) / 12.5) * height + 50;
    pathData.push(`${x},${y}`);
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'fixed', bottom: 140, left: 0 }}
    >
      <polyline
        fill="none"
        stroke="white"
        strokeWidth="4"
        points={pathData.join(' ')}
      />
    </svg>
  );
};

export const Tabs = () => {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    console.log(index);
    setToggleState(index);
  }

  return (
    <div className="container-tabs">
      <div className={toggleState === 1 ? "content active-content" : "content"}>
        <Home />
      </div>
      <div className={toggleState === 2 ? "content active-content" : "content"}>
        <CoolStuff />
      </div>
      <div className={toggleState === 3 ? "content active-content" : "content"}>
        <Resume />
      </div>
      <div className={toggleState === 4 ? "content active-content" : "content"}>
        <Contact />
      </div>
      <div className={toggleState === 5 ? "content active-content" : "content"}>
        <Photography />
      </div>

      <SineWave /> {/* New SineWave component */}

      <div className="bloc-tabs">
        <div className={toggleState === 1 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(1)}>Home</div>
        <div className={toggleState === 2 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(2)}>Cool Stuff</div>
        <div className={toggleState === 3 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(3)}>Resume</div>
        <div className={toggleState === 4 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(4)}>Contact</div>
        <div className={toggleState === 5 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(5)}>Photography</div>
      </div>
    </div>
  );
}
