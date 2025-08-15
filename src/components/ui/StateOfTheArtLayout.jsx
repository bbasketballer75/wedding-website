'use client';

/**
 * 🎨 STATE-OF-THE-ART LAYOUT ✨
 *
 * Professional layout system with navigation, footer, and content areas
 */

import { EnvelopeIcon, GlobeAltIcon, HeartIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { designTokens, getColor, getSpacing } from '../../styles/core/design-tokens';
import { StateOfTheArtButton } from './StateOfTheArtButton';
import { StateOfTheArtCard } from './StateOfTheArtCard';
import { StateOfTheArtNavigation } from './StateOfTheArtNavigation';

export const StateOfTheArtLayout = ({
  children,
  showNavigation = true,
  showFooter = true,
  variant = 'default',
  className = '',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="layout-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className={`state-of-the-art-layout ${variant} ${className}`}>
      {/* Navigation */}
      {showNavigation && <StateOfTheArtNavigation variant="glass" fixed={true} />}

      {/* Main Content */}
      <main className={`main-content ${showNavigation ? 'with-nav' : ''}`}>
        <div className="content-wrapper">{children}</div>
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="state-of-the-art-footer">
          <StateOfTheArtCard
            variant="wedding"
            size="large"
            hoverable={false}
            className="footer-card"
          >
            <div className="footer-content">
              {/* Wedding Couple */}
              <div className="footer-section wedding-info">
                <div className="couple-names">
                  <HeartIcon className="heart-icon" />
                  <h3>Austin & Jordyn Porada</h3>
                </div>
                <p className="wedding-date">Married on our beautiful wedding day</p>
                <p className="love-note">Thank you for being part of our love story</p>
              </div>

              {/* Quick Links */}
              <div className="footer-section">
                <h4>Explore Our Story</h4>
                <div className="footer-links">
                  <StateOfTheArtButton
                    variant="ghost"
                    size="small"
                    onClick={() => (window.location.href = '/our-story')}
                  >
                    Our Journey
                  </StateOfTheArtButton>
                  <StateOfTheArtButton
                    variant="ghost"
                    size="small"
                    onClick={() => (window.location.href = '/gallery')}
                  >
                    Photo Gallery
                  </StateOfTheArtButton>
                  <StateOfTheArtButton
                    variant="ghost"
                    size="small"
                    onClick={() => (window.location.href = '/guestbook')}
                  >
                    Guestbook
                  </StateOfTheArtButton>
                  <StateOfTheArtButton
                    variant="ghost"
                    size="small"
                    onClick={() => (window.location.href = '/love-map')}
                  >
                    Love Map
                  </StateOfTheArtButton>
                </div>
              </div>

              {/* Contact */}
              <div className="footer-section">
                <h4>Get in Touch</h4>
                <div className="contact-info">
                  <div className="contact-item">
                    <EnvelopeIcon className="contact-icon" />
                    <span>hello@theporadas.com</span>
                  </div>
                  <div className="contact-item">
                    <GlobeAltIcon className="contact-icon" />
                    <span>www.theporadas.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
              <div className="footer-divider" />
              <div className="footer-bottom-content">
                <p className="copyright">
                  © {new Date().getFullYear()} Austin & Jordyn Porada. Made with ❤️ for our family
                  and friends.
                </p>
                <div className="footer-tech">
                  <span className="tech-note">Built with state-of-the-art design system</span>
                </div>
              </div>
            </div>
          </StateOfTheArtCard>
        </footer>
      )}

      <style>{`
        .state-of-the-art-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(
            135deg,
            rgba(246, 249, 244, 0.3) 0%,
            rgba(234, 242, 228, 0.2) 100%
          );
        }

        .layout-loading {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            ${getColor('primary.50')} 0%,
            ${getColor('primary.100')} 100%
          );
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(143, 168, 118, 0.3);
          border-radius: 50%;
          border-top: 4px solid ${getColor('primary.500')};
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .main-content {
          flex: 1;
          width: 100%;
        }

        .main-content.with-nav {
          margin-top: 88px;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: ${getSpacing(6)};
        }

        .state-of-the-art-footer {
          margin-top: auto;
          padding: ${getSpacing(8)} ${getSpacing(6)};
        }

        .footer-card {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: ${getSpacing(8)};
          margin-bottom: ${getSpacing(6)};
        }

        .footer-section h3 {
          font-family: ${designTokens.typography.fontFamilies.serif};
          font-size: ${designTokens.typography.fontSizes['2xl']};
          font-weight: ${designTokens.typography.fontWeights.bold};
          color: ${getColor('neutral.800')};
          margin: 0 0 ${getSpacing(3)} 0;
        }

        .footer-section h4 {
          font-family: ${designTokens.typography.fontFamilies.sans};
          font-size: ${designTokens.typography.fontSizes.lg};
          font-weight: ${designTokens.typography.fontWeights.semibold};
          color: ${getColor('neutral.700')};
          margin: 0 0 ${getSpacing(4)} 0;
        }

        .couple-names {
          display: flex;
          align-items: center;
          gap: ${getSpacing(2)};
          margin-bottom: ${getSpacing(2)};
        }

        .heart-icon {
          width: 28px;
          height: 28px;
          color: ${getColor('primary.500')};
        }

        .wedding-date {
          color: ${getColor('neutral.600')};
          font-size: ${designTokens.typography.fontSizes.base};
          margin: 0 0 ${getSpacing(2)} 0;
        }

        .love-note {
          color: ${getColor('primary.600')};
          font-style: italic;
          font-size: ${designTokens.typography.fontSizes.base};
          margin: 0;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: ${getSpacing(2)};
          align-items: flex-start;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: ${getSpacing(3)};
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: ${getSpacing(2)};
          color: ${getColor('neutral.600')};
        }

        .contact-icon {
          width: 18px;
          height: 18px;
          color: ${getColor('primary.500')};
          flex-shrink: 0;
        }

        .footer-bottom {
          border-top: 1px solid rgba(143, 168, 118, 0.2);
          padding-top: ${getSpacing(4)};
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(143, 168, 118, 0.3) 50%,
            transparent 100%
          );
          margin-bottom: ${getSpacing(4)};
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: ${getSpacing(4)};
        }

        .copyright {
          color: ${getColor('neutral.600')};
          font-size: ${designTokens.typography.fontSizes.sm};
          margin: 0;
        }

        .tech-note {
          color: ${getColor('primary.600')};
          font-size: ${designTokens.typography.fontSizes.xs};
          font-weight: ${designTokens.typography.fontWeights.medium};
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .main-content.with-nav {
            margin-top: 76px;
          }

          .content-wrapper {
            padding: ${getSpacing(4)};
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: ${getSpacing(6)};
          }

          .footer-bottom-content {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .content-wrapper {
            padding: ${getSpacing(3)};
          }

          .state-of-the-art-footer {
            padding: ${getSpacing(6)} ${getSpacing(3)};
          }
        }
      `}</style>
    </div>
  );
};

StateOfTheArtLayout.propTypes = {
  children: PropTypes.node.isRequired,
  showNavigation: PropTypes.bool,
  showFooter: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'minimal', 'wedding']),
  className: PropTypes.string,
};

export default StateOfTheArtLayout;
