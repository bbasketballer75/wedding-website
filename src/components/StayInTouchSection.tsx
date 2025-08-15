'use client';
import React from 'react';
import '../StayInTouchSection.css';

const StayInTouchSection: React.FC = () => {
  return (
    <section
      id="stay-in-touch"
      className="stay-in-touch-section"
      aria-label="Stay connected with Austin and Jordyn"
    >
      <div className="container">
        <header className="stay-in-touch-header">
          <h2 className="section-title">
            <span className="script-text">Forever Connected</span>
          </h2>
          <p className="section-description">
            Join us as we begin this enchanting new chapter of our love story, and remain forever
            woven into the fabric of our hearts.
          </p>
        </header>

        <div className="contact-grid">
          <div className="contact-card">
            <h3 className="contact-title">Journey Through Our Adventures</h3>
            <p className="contact-description">
              Witness the beautiful tapestry of our married life as we weave new memories, discover
              magical places, and create moments of wonder together.
            </p>
            <div className="social-links">
              <a
                href="#instagram"
                className="social-link"
                aria-label="Follow Austin and Jordyn on Instagram"
              >
                📸 Instagram
              </a>
              <a
                href="#facebook"
                className="social-link"
                aria-label="Connect with Austin and Jordyn on Facebook"
              >
                📘 Facebook
              </a>
            </div>
          </div>

          <div className="contact-card">
            <h3 className="contact-title">Send Whispers of Love</h3>
            <p className="contact-description">
              Our hearts flutter with joy at every word from you. Share a cherished memory from our
              celebration, send us blessings for our journey, or simply let love flow through your
              words.
            </p>
            <a
              href="mailto:hello@theporadas.com"
              className="contact-button"
              aria-label="Send a love letter to Austin and Jordyn"
            >
              💌 Send Love Letters
            </a>
          </div>

          <div className="contact-card">
            <h3 className="contact-title">Gift Us Your Captured Magic</h3>
            <p className="contact-description">
              Did your lens capture moments of pure enchantment from our celebration? We would be
              eternally grateful to treasure these precious glimpses through your eyes.
            </p>
            <a
              href="#guestbook"
              className="contact-button"
              aria-label="Visit the sacred memory book to share photos"
            >
              📷 Share Sacred Moments
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StayInTouchSection;
