import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [zoom, setZoom] = useState(1); // Poziom zoomu
  const [azimuth, setAzimuth] = useState(0); // Azymut w stopniach
  const [startDistance, setStartDistance] = useState(0); // Odległość początkowa między dwoma palcami
  const [initialZoom, setInitialZoom] = useState(1); // Początkowy poziom zoomu
  const [offsetX, setOffsetX] = useState(0); // Przesunięcie w osi X
  const [offsetY, setOffsetY] = useState(0); // Przesunięcie w osi Y
  const zoomRef = useRef(1); // Referencja do poziomu zoomu
  const mapRef = useRef(null); // Referencja do mapy

  // Używamy useEffect do nasłuchiwania zmiany orientacji urządzenia
  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = event.alpha; // Azymut w stopniach (wskazuje kąt względem północy)
      if (alpha !== null) setAzimuth(alpha); // Ustawiamy azymut
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

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
    } else if (e.touches.length === 1) {
      // Obsługuje przesuwanie mapy jednym palcem
      const deltaX = e.touches[0].clientX - offsetX;
      const deltaY = e.touches[0].clientY - offsetY;
      setOffsetX(deltaX);
      setOffsetY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setStartDistance(0);
  };

  // Funkcja ograniczająca przesunięcie mapy, aby nie wykraczała poza ekran
  const constrainOffset = () => {
    if (mapRef.current) {
      const mapWidth = mapRef.current.offsetWidth * zoom;
      const mapHeight = mapRef.current.offsetHeight * zoom;
      const maxOffsetX = Math.max(0, mapWidth - window.innerWidth);
      const maxOffsetY = Math.max(0, mapHeight - window.innerHeight);

      setOffsetX(Math.min(Math.max(offsetX, -maxOffsetX), 0));
      setOffsetY(Math.min(Math.max(offsetY, -maxOffsetY), 0));
    }
  };

  useEffect(() => {
    constrainOffset();
  }, [zoom, offsetX, offsetY]); // Wywołujemy za każdym razem, gdy zmienia się zoom lub przesunięcie

  return (
    <div
      className="App"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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

        <div
          ref={mapRef}
          className="background"
          style={{
            transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
          }}
        >
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
