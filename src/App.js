import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [zoom, setZoom] = useState(1); // Poziom zoomu
  const [azimuth, setAzimuth] = useState(0); // Azymut w stopniach
  const [startDistance, setStartDistance] = useState(0); // Odległość początkowa między dwoma palcami
  const [initialZoom, setInitialZoom] = useState(1); // Początkowy poziom zoomu
  const zoomRef = useRef(1); // Referencja do poziomu zoomu

  // Używamy useEffect do nasłuchiwania zmiany orientacji urządzenia
  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = event.alpha; // Azymut w stopniach (wskazuje kąt względem północy)
      if (alpha !== null) setAzimuth(alpha); // Ustawiamy azymut
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Funkcja do obsługi zoomu przy użyciu przycisków
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3)); // Maksymalny zoom x3
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 1)); // Minimalny zoom x1

  // Obsługa gestu przybliżania (pinch zoom)
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setStartDistance(distance);
      setInitialZoom(zoomRef.current);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const zoomChange = (distance - startDistance) / 300;
      const newZoom = Math.min(Math.max(initialZoom + zoomChange, 1), 3);
      setZoom(newZoom);
      zoomRef.current = newZoom;
    }
  };

  const handleTouchEnd = () => {
    setStartDistance(0);
  };

  return (
    <div
      className="App"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Kompas (przyklejony w prawym górnym rogu) */}
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

      {/* Tło, skalowanie tylko tła */}
      <div
        className="background"
        style={{ transform: `scale(${zoom})` }}  
      >
        <img src={process.env.PUBLIC_URL + "/mapa_suli_topo.png"} alt="mapa suliszowice" className="background-image" />
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
