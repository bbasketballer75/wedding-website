'use client';

import React, { useState } from 'react';
import { socialShare } from '../../utils/seo/socialMeta';

interface ShareButtonProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Austin & Jordyn - Wedding Website',
  description = 'Celebrate with Austin & Jordyn',
  image = '/images/social/og-wedding-main.jpg',
  className = '',
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async (platform: string) => {
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = socialShare.facebook(url, title);
        break;
      case 'twitter':
        shareUrl = socialShare.twitter(url, title, ['wedding', 'theporadas', 'celebration']);
        break;
      case 'pinterest':
        shareUrl = socialShare.pinterest(url, title, image);
        break;
      case 'linkedin':
        shareUrl = socialShare.linkedin(url, title, description);
        break;
      case 'whatsapp':
        shareUrl = socialShare.whatsapp(url, title);
        break;
      case 'email':
        shareUrl = socialShare.email(url, title, description);
        break;
      case 'copy': {
        const success = await socialShare.copyLink(url);
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        break;
      }
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    }

    setIsOpen(false);

    // Track sharing analytics
    if (typeof window !== 'undefined' && 'weddingAnalytics' in window) {
      const analytics = (window as { weddingAnalytics?: { trackEvent: Function } })
        .weddingAnalytics;
      if (analytics) {
        analytics.trackEvent('share_action', {
          platform,
          url,
          title,
        });
      }
    }
  };

  // Native Web Share API fallback
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });

        // Track native sharing
        if (typeof window !== 'undefined' && 'weddingAnalytics' in window) {
          const analytics = (window as { weddingAnalytics?: { trackEvent: Function } })
            .weddingAnalytics;
          if (analytics) {
            analytics.trackEvent('share_action', {
              platform: 'native',
              url,
              title,
            });
          }
        }
      } catch {
        // User cancelled or error occurred
        console.warn('Share operation cancelled or failed');
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`share-button-container ${className}`}>
      {children ? (
        <button onClick={handleNativeShare} className="share-button" aria-label="Share this page">
          {children}
        </button>
      ) : (
        <button
          onClick={handleNativeShare}
          className="share-button share-button-default"
          aria-label="Share this page"
        >
          <svg
            className="share-icon"
            fill="currentColor"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
          </svg>
          Share
        </button>
      )}

      {isOpen && !navigator.share && (
        <div className="share-menu">
          <button
            className="share-menu-overlay"
            onClick={() => setIsOpen(false)}
            role="button"
            aria-label="Close share menu"
          />
          <div className="share-menu-content">
            <h3 className="share-menu-title">Share this page</h3>

            <div className="share-buttons-grid">
              <button
                onClick={() => handleShare('facebook')}
                className="share-option facebook"
                aria-label="Share on Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="share-option twitter"
                aria-label="Share on Twitter"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Twitter
              </button>

              <button
                onClick={() => handleShare('pinterest')}
                className="share-option pinterest"
                aria-label="Share on Pinterest"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.163-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                </svg>
                Pinterest
              </button>

              <button
                onClick={() => handleShare('whatsapp')}
                className="share-option whatsapp"
                aria-label="Share on WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                WhatsApp
              </button>

              <button
                onClick={() => handleShare('email')}
                className="share-option email"
                aria-label="Share via Email"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                Email
              </button>

              <button
                onClick={() => handleShare('copy')}
                className={`share-option copy ${copied ? 'copied' : ''}`}
                aria-label="Copy link"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                </svg>
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .share-button-container {
          position: relative;
          display: inline-block;
        }

        .share-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--sage-green, #9caf88);
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .share-button:hover {
          background: var(--sage-green-dark, #7a8b6c);
          transform: translateY(-1px);
        }

        .share-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .share-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .share-menu-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }

        .share-menu-content {
          position: relative;
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          max-width: 90vw;
          width: 400px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .share-menu-title {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary, #333);
          text-align: center;
        }

        .share-buttons-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .share-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          background: white;
          color: #374151;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .share-option:hover {
          border-color: var(--sage-green, #9caf88);
          background: #f9fafb;
          transform: translateY(-1px);
        }

        .share-option svg {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        .share-option.facebook:hover {
          border-color: #1877f2;
          color: #1877f2;
        }

        .share-option.twitter:hover {
          border-color: #1da1f2;
          color: #1da1f2;
        }

        .share-option.pinterest:hover {
          border-color: #e60023;
          color: #e60023;
        }

        .share-option.whatsapp:hover {
          border-color: #25d366;
          color: #25d366;
        }

        .share-option.email:hover {
          border-color: #ea4335;
          color: #ea4335;
        }

        .share-option.copy:hover {
          border-color: var(--sage-green, #9caf88);
          color: var(--sage-green, #9caf88);
        }

        .share-option.copied {
          border-color: #10b981;
          color: #10b981;
          background: #ecfdf5;
        }

        @media (max-width: 480px) {
          .share-buttons-grid {
            grid-template-columns: 1fr;
          }

          .share-menu-content {
            margin: 1rem;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default ShareButton;
