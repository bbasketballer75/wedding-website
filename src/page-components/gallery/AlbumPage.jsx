import React, { useState, useEffect } from 'react';
import { getAlbumMedia, uploadMedia } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';

import './AlbumPage.css';

const AlbumPage = () => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPhotos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAlbumMedia();
      setPhotos(response.data);
    } catch {
      setError(
        'Our photo sanctuary is temporarily resting. Please return in a moment to view our treasures!'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('photo', file);
      await uploadMedia(formData);
      setFile(null);
      const response = await getAlbumMedia();
      setPhotos(response.data);
      setIsUploading(false);
    }
  };

  return (
    <div className="album-page">
      {(isLoading || isUploading) && (
        <LoadingScreen
          message={
            isUploading
              ? 'Weaving your treasure into our collection...'
              : 'Illuminating our gallery of cherished moments...'
          }
        />
      )}
      {!isLoading && !isUploading && error && (
        <div className="error-state">
          <div className="error-message" role="alert">
            {error}
          </div>
          <button onClick={fetchPhotos} className="btn accent retry-btn">
            Try Again
          </button>
        </div>
      )}
      {!isLoading && !isUploading && !error && (
        <>
          <h2 className="section-title">Gallery of Eternal Moments</h2>
          <p className="album-subheading">
            This sacred collection holds the essence of our love story forever! Explore the poetry
            of our wedding day through professional portraits, spontaneous laughter, and
            behind-the-scenes enchantment. We would be honored for you to contribute your own
            captured memories and help us see our celebration through your loving eyes.
          </p>
          <div className="upload-section">
            <label htmlFor="album-upload-input" className="visually-hidden">
              Contribute a treasured moment from our celebration
            </label>
            <input
              id="album-upload-input"
              type="file"
              onChange={handleFileChange}
              aria-label="Share your captured wedding magic - photo or video"
            />
            <button onClick={handleUpload} className="btn accent">
              Gift Your Memory ✨
            </button>
          </div>
          <div className="photo-grid">
            {photos.length === 0 ? (
              <div className="empty-state">
                This sacred gallery awaits your beautiful treasures! Be the first to grace our
                collection with a precious moment from our celebration.
              </div>
            ) : (
              photos.map((photo) => (
                <div key={photo._id} className="photo-card">
                  {photo.webpPath && photo.jpegPath ? (
                    <picture>
                      <source srcSet={`/${photo.webpPath}`} type="image/webp" />
                      <source srcSet={`/${photo.jpegPath}`} type="image/jpeg" />
                      <img src={`/${photo.jpegPath}`} alt="Wedding memory" loading="lazy" />
                    </picture>
                  ) : (
                    <img src={`/uploads/${photo.filename}`} alt="Wedding memory" loading="lazy" />
                  )}
                  <a
                    href={photo.jpegPath ? `/${photo.jpegPath}` : `/uploads/${photo.filename}`}
                    download
                    className="btn secondary download-btn"
                    aria-label="Download photo"
                  >
                    Download
                  </a>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AlbumPage;
