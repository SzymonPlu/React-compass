import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [zoom, setZoom] = useState(1);
  const [azimuth, setAzimuth] = useState(0);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);
  const startDistance = useRef(0);
  const initialZoom = useRef(1);
  const initialTranslate = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = event.alpha;
      if (alpha !== null) setAzimuth(alpha);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Zainicjuj przybliżenie
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      startDistance.current = distance;
      initialZoom.current = zoom;
    } else if (e.touches.length === 1) {
      // Zainicjuj przesunięcie
      initialTranslate.current = {
        x: e.touches[0].clientX - translate.x,
        y: e.touches[0].clientY - translate.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (e.touches.length === 2) {
        // Oblicz skalowanie
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const zoomChange = (distance - startDistance.current) / 300;
        const newZoom = Math.min(Math.max(initialZoom.current + zoomChange, 1), 3);
        setZoom(newZoom);
      } else if (e.touches.length === 1) {
        // Oblicz przesunięcie
        const deltaX = e.touches[0].clientX - initialTranslate.current.x;
        const deltaY = e.touches[0].clientY - initialTranslate.current.y;
        setTranslate({ x: deltaX, y: deltaY });
      }
    });
  };

  const handleTouchEnd = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
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
            transform: `scale(${zoom}) translate(${translate.x}px, ${translate.y}px)`,
            transformOrigin: "center center"
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
