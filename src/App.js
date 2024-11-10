import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [zoom, setZoom] = useState(1); // Poziom zoomu
  const [azimuth, setAzimuth] = useState(0); // Azymut w stopniach

  // Używamy useEffect do nasłuchiwania zmiany orientacji urządzenia
  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = event.alpha; // Azymut w stopniach (wskazuje kąt względem północy)
      if (alpha !== null) setAzimuth(alpha); // Ustawiamy azymut
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
        {/* Obrót strzałki kompasu względem azymutu (wskazuje na prawdziwą północ) */}
        <img 
          src={process.env.PUBLIC_URL + "/compas.png"} 
          alt="Kompas"
          className="compass-icon"
          style={{ transform: `rotate(${-azimuth}deg)` }} // Obrót w zależności od azymutu
        />
        {/* Czerwona strzałka wskazująca północ */}
        <div className="north-arrow" style={{ transform: `rotate(${azimuth}deg)` }}></div>
        
        {/* Wyświetlamy aktualny azymut */}
        <span className="azimuth-value">{Math.round(azimuth)}°</span>
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
