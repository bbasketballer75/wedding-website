import React, { useState, useEffect } from 'react';
import { getMapLocations as getPins } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';
import './MapPage.css';

const MapPage = () => {
  const [pins, setPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPins = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPins();
        setPins(response.data);
      } catch {
        setError(
          "We can't load the love map right now, but we know your heart traveled far to be with us! Please try again in a moment."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchPins();
  }, []);

  return (
    <div className="map-page">
      {isLoading && <LoadingScreen message="Mapping all the love that traveled to be with us..." />}
      {!isLoading && (
        <>
          <h2 className="section-title">Love Traveled Far & Wide</h2>
          <p className="subheading">
            Our hearts are amazed by the distances our friends and family traveled to celebrate with
            us! See the beautiful map of love that shows where our wonderful guests came from to
            share in our special day.
          </p>
          {error ? (
            <div className="error-message" role="alert">
              {error}
            </div>
          ) : (
            <div className="simple-map-container">
              <h3>Our Guest Love Map</h3>
              <div>
                <p>🌍 Celebrating love from around the world</p>
                <p>📍 {pins.length} beautiful places our loved ones call home</p>
                <div>
                  {pins.length > 0 && (
                    <div>
                      <h4>Locations:</h4>
                      <ul>
                        {pins.slice(0, 5).map((pin, idx) => (
                          <li key={`${pin.lat}-${pin.lng}-${idx}`}>
                            📍 {pin.label || `Location ${idx + 1}`}
                          </li>
                        ))}
                        {pins.length > 5 && (
                          <li style={{ fontStyle: 'italic' }}>
                            ... and {pins.length - 5} more locations
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.8 }}>
                  Interactive map functionality will be restored soon
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MapPage;
