'use client';

import React from 'react';

const SkipLinks: React.FC = () => {
  return (
    <div className="skip-links">
      <a href="#main-content" className="skip-link" aria-label="Skip to main content">
        Skip to main content
      </a>
      <a href="#navigation" className="skip-link" aria-label="Skip to navigation">
        Skip to navigation
      </a>
      <style>{`
        .skip-links {
          position: absolute;
          top: -40px;
          left: 6px;
          z-index: 1000;
        }
        
        .skip-link {
          position: absolute;
          left: -10000px;
          width: 1px;
          height: 1px;
          overflow: hidden;
          padding: 8px 16px;
          background: #000;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .skip-link:focus {
          position: static;
          left: auto;
          width: auto;
          height: auto;
          overflow: visible;
          clip: auto;
          white-space: nowrap;
        }
        
        .skip-link:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
};

export default SkipLinks;
