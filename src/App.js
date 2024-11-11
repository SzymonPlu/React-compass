import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [zoom, setZoom] = useState(1);
  const [azimuth, setAzimuth] = useState(0);
  const mapRef = useRef(null);
  const initialOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });
  const startDistance = useRef(0);
  const initialZoom = useRef(1);
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
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      startDistance.current = distance;
      initialZoom.current = zoom;
    } else if (e.touches.length === 1) {
      initialOffset.current = {
        x: e.touches[0].clientX - currentOffset.current.x,
        y: e.touches[0].clientY - currentOffset.current.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      if (e.touches.length === 2) {
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const zoomChange = (distance - startDistance.current) / 300;
        const newZoom = Math.min(Math.max(initialZoom.current + zoomChange, 1), 3);
        setZoom(newZoom);
        mapRef.current.style.transform = `scale(${newZoom}) translate(${currentOffset.current.x}px, ${currentOffset.current.y}px)`;
      } else if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - initialOffset.current.x;
        const deltaY = e.touches[0].clientY - initialOffset.current.y;
        currentOffset.current = { x: deltaX, y: deltaY };
        mapRef.current.style.transform = `scale(${zoom}) translate(${deltaX}px, ${deltaY}px)`;
      }
    });
  };

  const handleTouchEnd = () => {
    startDistance.current = 0;
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

        <div ref={mapRef} className="background">
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
