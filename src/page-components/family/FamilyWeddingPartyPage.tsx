'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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

const FamilyWeddingPartyPage: React.FC = () => {
  const [modalVideo, setModalVideo] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const bridesmaids = [
    { name: 'Brinnah Porada', image: '/images/wedding-party/bridesmaids/brinnah-porada.webp' },
    { name: 'Caitie Helsel', image: '/images/wedding-party/bridesmaids/caitie-helsel.webp' },
    { name: 'Emily Aurandt', image: '/images/wedding-party/bridesmaids/emily-aurandt.webp' },
    { name: 'Hannah Porada', image: '/images/wedding-party/bridesmaids/hannah-porada.webp' },
    { name: 'Lexi Ferg', image: '/images/wedding-party/bridesmaids/lexi-ferg.webp' },
    { name: 'Maria McCray', image: '/images/wedding-party/bridesmaids/maria-mccray.webp' },
    { name: 'Mic', image: '/images/wedding-party/bridesmaids/mic.webp' },
  ];

  const groomsmen = [
    { name: 'Alex Molnar', image: '/images/wedding-party/groomsmen/alex-molnar.webp' },
    { name: 'Brosonan McCray', image: '/images/wedding-party/groomsmen/brosonan-mccray.webp' },
    { name: 'Ean Pringle', image: '/images/wedding-party/groomsmen/ean-pringle.webp' },
    { name: 'Eddie Migut', image: '/images/wedding-party/groomsmen/eddie-migut.webp' },
    { name: 'Ian Porada', image: '/images/wedding-party/groomsmen/ian-porada.webp' },
    { name: 'Nate Berkebile', image: '/images/wedding-party/groomsmen/nate-berkebile.webp' },
    { name: 'Tyler Sharpe', image: '/images/wedding-party/groomsmen/tyler-sharpe.webp' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="family-wedding-party-page">
      <div className="family-tree-header">
        <h2 className="section-title">Our People</h2>
        <p className="section-subtitle">
          The incredible people who shaped our hearts and stood by our side
        </p>
      </div>

      {/* Austin & Jordyn at the top */}
      <div className="couple-section">
        <div className="couple-container">
          <div className="couple-member">
            <div className="couple-image-container">
              <Image
                src="/images/austin.webp"
                alt="Austin Porada"
                width={300}
                height={300}
                className="couple-image"
              />
            </div>
            <h3 className="couple-name">Austin</h3>
            <p className="couple-title">Groom</p>
          </div>

          <div className="couple-heart">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="heart-icon">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill="var(--blush-primary)"
                stroke="var(--sage-primary)"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="couple-member">
            <div className="couple-image-container">
              <Image
                src="/images/jordyn.webp"
                alt="Jordyn Pringle"
                width={300}
                height={300}
                className="couple-image"
              />
            </div>
            <h3 className="couple-name">Jordyn</h3>
            <p className="couple-title">Bride</p>
          </div>
        </div>
      </div>

      {/* Parents Section */}
      <div className="parents-section">
        <h3 className="subsection-title">Our Beloved Parents</h3>
        <div className="family-tree-container">
          {/* Bride's Parents */}
          <div className="family-side bride-side">
            <div className="side-header">
              <h4 className="side-title">Jordyn&apos;s Parents</h4>
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
                  }}
                  aria-label={`Play video for ${parent.display}`}
                  onClick={() => setModalVideo(parent.video)}
                  onMouseEnter={() => setHoveredCard(parent.name)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="card-inner">
                    <div className="family-member-image-container">
                      <Image
                        src={parent.image}
                        alt={parent.display}
                        className="family-member-image"
                        width={200}
                        height={200}
                        sizes="(max-width: 768px) 150px, 200px"
                      />
                      <div className="image-overlay">
                        <span className="family-member-play-btn" aria-hidden="true">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="family-member-content">
                      <h5 className="family-member-name">{parent.display}</h5>
                      <p className="family-member-relation">{parent.relation}</p>
                      <blockquote className="family-member-quote">
                        &ldquo;{parent.quote}&rdquo;
                      </blockquote>
                    </div>
                  </div>
                  {hoveredCard === parent.name && (
                    <div className="card-glow" aria-hidden="true"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Groom's Parents */}
          <div className="family-side groom-side">
            <div className="side-header">
              <h4 className="side-title">Austin&apos;s Parents</h4>
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
                  }}
                  aria-label={`Play video for ${parent.display}`}
                  onClick={() => setModalVideo(parent.video)}
                  onMouseEnter={() => setHoveredCard(parent.name)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="card-inner">
                    <div className="family-member-image-container">
                      <Image
                        src={parent.image}
                        alt={parent.display}
                        className="family-member-image"
                        width={200}
                        height={200}
                        sizes="(max-width: 768px) 150px, 200px"
                      />
                      <div className="image-overlay">
                        <span className="family-member-play-btn" aria-hidden="true">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="family-member-content">
                      <h5 className="family-member-name">{parent.display}</h5>
                      <p className="family-member-relation">{parent.relation}</p>
                      <blockquote className="family-member-quote">
                        &ldquo;{parent.quote}&rdquo;
                      </blockquote>
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
      </div>

      {/* Wedding Party Section */}
      <div className="wedding-party-section">
        <h3 className="subsection-title">Our Wedding Party</h3>

        <div className="party-section">
          <h4 className="party-subheading">Bridesmaids</h4>
          <div className="party-grid">
            {bridesmaids.map((member) => (
              <div key={member.name} className="party-member-card">
                <Image
                  src={member.image}
                  alt={member.name}
                  className="party-member-image"
                  width={300}
                  height={400}
                  sizes="(max-width: 768px) 150px, 300px"
                  priority={false}
                />
                <h5 className="party-member-name">{member.name}</h5>
              </div>
            ))}
          </div>
        </div>

        <div className="party-section">
          <h4 className="party-subheading">Groomsmen</h4>
          <div className="party-grid">
            {groomsmen.map((member) => (
              <div key={member.name} className="party-member-card">
                <Image
                  src={member.image}
                  alt={member.name}
                  className="party-member-image"
                  width={300}
                  height={400}
                  sizes="(max-width: 768px) 150px, 300px"
                  priority={false}
                />
                <h5 className="party-member-name">{member.name}</h5>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalVideo && <VideoModal videoUrl={modalVideo} onClose={() => setModalVideo(null)} />}
    </div>
  );
};

export default FamilyWeddingPartyPage;
