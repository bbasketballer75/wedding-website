import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './VideoModal.css';

function VideoModal({ videoUrl, onClose }) {
  const [loading, setLoading] = useState(true);
  const closeBtnRef = useRef();
  const modalRef = useRef();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    closeBtnRef.current && closeBtnRef.current.focus();
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Focus trap for accessibility
  useEffect(() => {
    const trap = (e) => {
      if (!modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll(
        'button, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', trap);
    return () => window.removeEventListener('keydown', trap);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Hide spinner when iframe loads
  const handleIframeLoad = () => setLoading(false);

  return (
    <dialog
      className="video-modal-overlay fade-in"
      aria-labelledby="video-modal-title"
      aria-modal="true"
      open
      ref={modalRef}
    >
      <div className="video-modal-content scale-in">
        <h2 id="video-modal-title" className="sr-only">
          Video Player
        </h2>
        <button
          className="video-modal-close"
          onClick={onClose}
          aria-label="Close video"
          ref={closeBtnRef}
        >
          ×
        </button>
        {loading && (
          <output className="video-modal-spinner loading-spinner" aria-live="polite">
            <span className="sr-only">Loading video</span>
          </output>
        )}
        <iframe
          src={videoUrl + '?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0'}
          title="Parent Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
          frameBorder="0"
          className="video-modal-iframe"
          style={loading ? { visibility: 'hidden' } : {}}
          onLoad={handleIframeLoad}
        />
      </div>
    </dialog>
  );
}

VideoModal.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VideoModal;
