'use client';
import React from 'react';
import '../ThankYouSection.css';

const ThankYouSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="hero-section"
      aria-label="Thank you message from Austin and Jordyn"
    >
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="script-text">Thank You</span>
          </h1>

          <div className="hero-message">
            <p className="lead-text">
              From the depths of our souls, we are eternally grateful for your presence at our
              sacred celebration of love.
            </p>

            <p className="body-text">
              Your radiant spirits, warm embraces, and joyful tears transformed our special day into
              an absolutely enchanting tapestry of love. Each smile, each dance, each whispered
              blessing became a precious thread woven into the fabric of our hearts.
            </p>

            <p className="body-text">
              We invite you to wander through these cherished moments and add your own beautiful
              memories to our eternal love story.
            </p>

            <div className="signature">
              <span className="script-signature">With endless love and gratitude,</span>
              <span className="names">Austin & Jordyn</span>
            </div>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="floral-accent" aria-hidden="true">
            ✨🌿✨
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThankYouSection;
