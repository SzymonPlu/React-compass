import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [zoom, setZoom] = useState(1); // Początkowy poziom zoomu ustawiamy na 1
  const [azimuth, setAzimuth] = useState(0); // Azymut w stopniach
  const [startDistance, setStartDistance] = useState(0); // Odległość początkowa między dwoma palcami
  const [initialZoom, setInitialZoom] = useState(1); // Początkowy poziom zoomu
  const mapRef = useRef(null); // Referencja do mapy
  const offsetRef = useRef({ x: 0, y: 0 }); // Referencja do offsetów

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
      setInitialZoom(zoom);
    } else if (e.touches.length === 1) {
      // Zapisujemy początkowe pozycje dotyku w referencji
      offsetRef.current.x = e.touches[0].clientX;
      offsetRef.current.y = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const zoomChange = (distance - startDistance) / 300;
      const newZoom = Math.min(Math.max(initialZoom + zoomChange, 1), 3); // Maksymalny zoom = 3
      setZoom(newZoom);
    } else if (e.touches.length === 1) {
      // Obliczamy przesunięcie względem początkowej pozycji dotyku
      const deltaX = e.touches[0].clientX - offsetRef.current.x;
      const deltaY = e.touches[0].clientY - offsetRef.current.y;

      // Zmieniamy referencję na nową pozycję
      offsetRef.current.x = e.touches[0].clientX;
      offsetRef.current.y = e.touches[0].clientY;

      // Zmieniamy pozycję mapy bez używania stanu, co unika niepotrzebnych renderów
      mapRef.current.style.transform = `scale(${zoom}) translate(${deltaX}px, ${deltaY}px)`;
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
            transform: `scale(${zoom})`, // Tylko skalowanie, przesuwanie odbywa się bezpośrednio w stylach
            transition: 'transform 0.2s ease', // Płynna animacja dla transformacji
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
