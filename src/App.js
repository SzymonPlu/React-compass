import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [azimuth, setAzimuth] = useState(0);

  useEffect(() => {
    const handleOrientation = (event) => {
      const newAzimuth = event.alpha ? event.alpha : 0;
      setAzimuth(newAzimuth);
    };

    // Nasłuchuj zdarzeń zmiany orientacji urządzenia
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <div className="wrapper">
      {/* Tło, które można skalować */}
      <div className="background">
        <img
          src={process.env.PUBLIC_URL + "/mapa_suli_topo.png"}
          alt="mapa suliszowice"
          className="background-image"
        />
      </div>

      {/* Nakładka kompasu */}
      <div className="compass-container">
        <img
          src={process.env.PUBLIC_URL + "/compas.png"}
          alt="Kompas"
          className="compass-icon"
        />
        <div
          className="compass-arrow"
          style={{ transform: `rotate(${azimuth}deg)` }}
        >
          {/* Strzałka */}
          <div className="north-arrow"></div>
        </div>
        <div className="azimuth-value">{Math.round(azimuth)}°</div>
      </div>
    </div>
  );
};

export default App;
