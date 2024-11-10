// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [zoom, setZoom] = useState(1); // Poziom zoomu
  const [azimuth, setAzimuth] = useState(0); // Azymut w stopniach

  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = event.alpha;
      if (alpha !== null) setAzimuth(Math.round(alpha));
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3)); // Maksymalny zoom x3
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 1)); // Minimalny zoom x1

  return (
    <div className="App">
      {/* Kompas */}
      <div className="compass-container">
      <img src={process.env.PUBLIC_URL + "/compas.png"} alt="Kompas" className="compass-icon" />
        <span className="azimuth-value">{azimuth}°</span>
      </div>

      {/* Tło */}
      <div
        className="background"
        style={{ transform: `scale(${zoom})` }}
      >
        <img src={process.env.PUBLIC_URL + "/mapa-suliszowice.jpg"} alt="mapa suliszowice" className="background-image" />
      </div>

      {/* Przyciski zoomu */}
      <div className="zoom-controls">
        <button onClick={handleZoomIn}>+</button>
        <button onClick={handleZoomOut}>-</button>
      </div>
    </div>
  );
};

export default App;
