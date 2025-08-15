'use client';

import { useEffect, useState } from 'react';
import MagicalPhotoGallery from '../../components/features/MagicalPhotoGallery';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { getAlbumMedia, uploadMedia } from '../../services/api';
import { useInteractionSounds } from '../components/AmbientSoundSystem';
import { useToast, useWeddingToasts } from '../components/MagicalToastSystem';

import './AlbumPage.css';

const MagicalAlbumPage = () => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const { showSuccess, showError } = useToast();
  const { galleryShared } = useWeddingToasts();
  const { playClick } = useInteractionSounds();

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
      showError('Unable to load photos. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    playClick();
  };

  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);
      playClick();

      try {
        const formData = new FormData();
        formData.append('photo', file);
        await uploadMedia(formData);
        setFile(null);
        const response = await getAlbumMedia();
        setPhotos(response.data);
        showSuccess('Photo uploaded successfully!', '📸 Upload Complete');
      } catch (error) {
        console.error('Upload error:', error);
        showError('Failed to upload photo. Please try again.');
        // Additional error handling could be added here
        throw error; // Re-throw to maintain error propagation
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleShare = () => {
    playClick();
    galleryShared();

    if (navigator.share) {
      navigator.share({
        title: 'Austin & Jordyn Wedding Photos',
        text: 'Check out our beautiful wedding photos!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Link copied to clipboard!', '📱 Share Ready');
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading our magical photo gallery..." />;
  }

  if (error) {
    return (
      <div className="album-page error-state">
        <div className="album-header">
          <h2 className="album-title">📸 Our Photo Gallery</h2>
          <p className="error-message">{error}</p>
          <button
            onClick={() => {
              playClick();
              fetchPhotos();
            }}
            className="retry-button magical-button"
          >
            ✨ Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="album-page magical-album-page">
      <div className="album-header">
        <h2 className="album-title">📸 Our Magical Photo Gallery</h2>
        <p className="album-subtitle">Capturing every precious moment of our journey together ✨</p>

        {/* Enhanced Upload Section */}
        <div className="upload-section">
          <div className="upload-controls">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
              id="photo-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="photo-upload"
              className="file-label magical-button"
              style={{ opacity: isUploading ? 0.7 : 1 }}
            >
              📷 Choose Photo
            </label>

            {file && (
              <div className="file-preview">
                <span className="file-name">{file.name}</span>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="upload-button magical-button"
                >
                  {isUploading ? '✨ Uploading...' : '🚀 Upload Photo'}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleShare}
            className="share-button magical-button"
            title="Share our photo gallery"
          >
            📱 Share Gallery
          </button>
        </div>
      </div>

      {/* Magical Photo Gallery */}
      {photos && photos.length > 0 ? (
        <MagicalPhotoGallery
          photos={photos}
          onPhotoLoved={() => {
            playClick();
            showSuccess('Photo loved!', '💕 Added to Favorites');
          }}
        />
      ) : (
        <div className="empty-gallery">
          <div className="empty-message">
            <h3>🌟 Gallery Coming Soon!</h3>
            <p>We're preparing something magical for you. Photos will appear here soon!</p>
          </div>
        </div>
      )}

      <style>{`
        .magical-album-page {
          position: relative;
          background: linear-gradient(135deg, rgba(255, 182, 193, 0.1), rgba(221, 160, 221, 0.1));
          min-height: 100vh;
          padding: 2rem 0;
        }

        .album-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 0 2rem;
        }

        .album-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #ff69b4, #dda0dd, #ffb6c1);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: titleShimmer 3s ease-in-out infinite;
        }

        .album-subtitle {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 2rem;
          font-style: italic;
        }

        .upload-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.7);
          padding: 2rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto 2rem;
        }

        .upload-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .file-input {
          display: none;
        }

        .file-label {
          background: linear-gradient(45deg, #ff69b4, #dda0dd);
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          display: inline-block;
        }

        .file-label:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 10px 25px rgba(255, 105, 180, 0.4);
        }

        .file-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 15px;
          min-width: 200px;
        }

        .file-name {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
          text-align: center;
          word-break: break-word;
        }

        .upload-button,
        .share-button,
        .retry-button {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .upload-button:hover,
        .share-button:hover,
        .retry-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
        }

        .upload-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .share-button {
          background: linear-gradient(45deg, #3b82f6, #2563eb);
        }

        .share-button:hover {
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .empty-gallery {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
          padding: 2rem;
        }

        .empty-message {
          text-align: center;
          background: rgba(255, 255, 255, 0.8);
          padding: 3rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        .empty-message h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .empty-message p {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
        }

        .error-state {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 50vh;
          padding: 2rem;
        }

        .error-message {
          color: #ef4444;
          font-size: 1.1rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .retry-button {
          background: linear-gradient(45deg, #ef4444, #dc2626);
        }

        .retry-button:hover {
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
        }

        @keyframes titleShimmer {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @media (max-width: 768px) {
          .album-title {
            font-size: 2rem;
          }

          .album-subtitle {
            font-size: 1rem;
          }

          .upload-section {
            padding: 1.5rem;
            margin: 0 1rem 2rem;
          }

          .upload-controls {
            width: 100%;
          }

          .file-preview {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default MagicalAlbumPage;
