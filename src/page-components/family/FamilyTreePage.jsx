import React, { useState, useEffect } from 'react';
import VideoModal from '../../components/media/VideoModal';
import './FamilyTreePage-enhanced.css';

const PARENT_VIDEOS = [
  {
    name: 'Jerame',
    display: "Jerame (Jordyn's Dad)",
    relation: 'Father of the Bride',
    side: 'bride',
    image: '/images/parents/jerame.webp',
    video: 'https://www.youtube.com/embed/4eN1UNG7NjQ',
    quote: 'Seeing my daughter find her perfect match fills my heart with joy.',
    background: 'linear-gradient(135deg, var(--blush-whisper) 0%, var(--blush-mist) 100%)',
  },
  {
    name: 'Christine',
    display: "Christine (Jordyn's Mom)",
    relation: 'Mother of the Bride',
    side: 'bride',
    image: '/images/parents/christine.webp',
    video: 'https://www.youtube.com/embed/rvXBYiBEaSM',
    quote: "Watching love bloom is life's greatest treasure.",
    background: 'linear-gradient(135deg, var(--blush-whisper) 0%, var(--blush-mist) 100%)',
  },
  {
    name: 'Heather',
    display: "Heather (Austin's Mom)",
    relation: 'Mother of the Groom',
    side: 'groom',
    image: '/images/parents/heather.webp',
    video: 'https://www.youtube.com/embed/C22dgo_w4Oo',
    quote: 'Austin has found his forever person, and my heart is complete.',
    background: 'linear-gradient(135deg, var(--sage-whisper) 0%, var(--sage-mist) 100%)',
  },
  {
    name: 'Melony',
    display: "Melony (Austin's Mom)",
    relation: 'Mother of the Groom',
    side: 'groom',
    image: '/images/parents/melony.webp',
    video: 'https://www.youtube.com/embed/BAY3F9Yi9s0',
    quote: 'The love they share reminds us what true partnership looks like.',
    background: 'linear-gradient(135deg, var(--sage-whisper) 0%, var(--sage-mist) 100%)',
  },
];

const FamilyTreePage = () => {
  const [modalVideo, setModalVideo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="family-tree-page">
      <div className="family-tree-header">
        <h2 className="section-title">The Hearts Behind Our Love Story</h2>
        <p className="section-subtitle">
          Meet the extraordinary people who raised us, shaped our values, and taught us what true
          love looks like. Their wisdom, support, and endless love brought us to this beautiful
          moment in our lives.
        </p>
      </div>

      <div className="family-tree-container">
        {/* Bride's Side */}
        <div className="family-side bride-side">
          <div className="side-header">
            <h3 className="side-title">Jordyn's Loving Family</h3>
            <div className="side-decoration bride-decoration"></div>
          </div>
          <div className="family-grid">
            {PARENT_VIDEOS.filter((parent) => parent.side === 'bride').map((parent, index) => (
              <button
                key={parent.name}
                className={`family-member-card family-member-card-clickable ${isVisible ? 'animate-in' : ''}`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  background: parent.background,
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
                type="button"
                aria-label={`Play video for ${parent.display}`}
                onClick={() => setModalVideo(parent.video)}
                onMouseEnter={() => setHoveredCard(parent.name)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-inner">
                  <div className="family-member-image-container">
                    <img src={parent.image} alt={parent.display} className="family-member-image" />
                    <div className="image-overlay">
                      <span className="family-member-play-btn" aria-hidden="true">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className="family-member-content">
                    <h4 className="family-member-name">{parent.display}</h4>
                    <p className="family-member-relation">{parent.relation}</p>
                    <blockquote className="family-member-quote">"{parent.quote}"</blockquote>
                  </div>
                </div>
                {hoveredCard === parent.name && (
                  <div className="card-glow" aria-hidden="true"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Central Heart */}
        <div className="family-center">
          <div className="love-symbol">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="heart-icon">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill="var(--blush-primary)"
                stroke="var(--sage-primary)"
                strokeWidth="1"
              />
            </svg>
            <p className="love-message">United in Love</p>
          </div>
        </div>

        {/* Groom's Side */}
        <div className="family-side groom-side">
          <div className="side-header">
            <h3 className="side-title">Austin's Loving Family</h3>
            <div className="side-decoration groom-decoration"></div>
          </div>
          <div className="family-grid">
            {PARENT_VIDEOS.filter((parent) => parent.side === 'groom').map((parent, index) => (
              <button
                key={parent.name}
                className={`family-member-card family-member-card-clickable ${isVisible ? 'animate-in' : ''}`}
                style={{
                  animationDelay: `${(index + 2) * 200}ms`,
                  background: parent.background,
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
                type="button"
                aria-label={`Play video for ${parent.display}`}
                onClick={() => setModalVideo(parent.video)}
                onMouseEnter={() => setHoveredCard(parent.name)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-inner">
                  <div className="family-member-image-container">
                    <img src={parent.image} alt={parent.display} className="family-member-image" />
                    <div className="image-overlay">
                      <span className="family-member-play-btn" aria-hidden="true">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className="family-member-content">
                    <h4 className="family-member-name">{parent.display}</h4>
                    <p className="family-member-relation">{parent.relation}</p>
                    <blockquote className="family-member-quote">"{parent.quote}"</blockquote>
                  </div>
                </div>
                {hoveredCard === parent.name && (
                  <div className="card-glow" aria-hidden="true"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {modalVideo && <VideoModal videoUrl={modalVideo} onClose={() => setModalVideo(null)} />}
    </div>
  );
};

export default FamilyTreePage;
