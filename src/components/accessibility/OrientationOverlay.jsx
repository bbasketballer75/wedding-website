import React, { useEffect, useState } from 'react';
import './OrientationOverlay.css';

function isPortrait() {
  return window.matchMedia('(orientation: portrait)').matches;
}

const OrientationOverlay = () => {
  const [show, setShow] = useState(isPortrait());

  useEffect(() => {
    const onResize = () => setShow(isPortrait());
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  const handleForceLandscape = () => {
    setShow(false);
  };

  if (!show) return null;
  return (
    <div
      className="orientation-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="orientation-title"
      aria-describedby="orientation-message"
    >
      <div className="orientation-content scale-in">
        <div className="orientation-icon">↻</div>
        <h2 id="orientation-title" className="orientation-title">
          Please Rotate Your Device
        </h2>
        <p id="orientation-message" className="orientation-message">
          For the best experience, view this site in landscape mode.
        </p>
        <button className="btn" onClick={handleForceLandscape}>
          Continue Anyway
        </button>
      </div>
    </div>
  );
};

export default OrientationOverlay;
