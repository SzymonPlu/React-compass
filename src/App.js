import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [azimuth, setAzimuth] = useState(0); // Azymut w stopniach
  const [zoom, setZoom] = useState(1); // Początkowy poziom zoomu

  // Nasłuchiwanie zmiany orientacji urządzenia, aby obrócić kompas
  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = event.alpha; // Azymut w stopniach
      if (alpha !== null) setAzimuth(alpha);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Funkcja obsługująca zmianę powiększenia za pomocą kółka myszy (alternatywnie do pinch-zoom na telefonie)
  const handleWheelZoom = (event) => {
    event.preventDefault();
    const zoomChange = event.deltaY * -0.001; // Dostosowanie prędkości zoomu
    setZoom((prevZoom) => Math.min(Math.max(prevZoom + zoomChange, 1), 3)); // Ograniczenie zoomu między 1 a 3
  };

  return (
    <div className="App">
      <div className="map-container">
        <div className="compass-container">
          <img
            src={process.env.PUBLIC_URL + "/compas.png"}
            alt="Kompas"
            className="compass-icon"
            style={{ transform: `rotate(${-azimuth}deg)` }}
          />
          <div className="north-arrow" style={{ transform: `rotate(${azimuth}deg)` }}></div>
          <span className="azimuth-value">{Math.round(azimuth)}°</span>
        </div>

        {/* Obrazek mapy z obsługą zoomu */}
        <div className="background" onWheel={handleWheelZoom} style={{ transform: `scale(${zoom})` }}>
          <img
            src={process.env.PUBLIC_URL + "/mapa_suli_topo.png"}
            alt="mapa suliszowice"
            className="background-image"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
