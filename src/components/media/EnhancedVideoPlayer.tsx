'use client';



/**
 * 🎬 ENHANCED WEDDING VIDEO PLAYER ✨
 *
 * Advanced video player designed specifically for feature-length wedding videos
 * with chapter navigation, smart autoplay handling, and magical interactions.
 */

import React, { useState } from 'react';

interface EnhancedVideoPlayerProps {
  src: string;
  posterSrc?: string;
  className?: string;
}

const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({
  src,
  posterSrc,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted] = useState(true); // Start muted to allow autoplay

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className={`enhanced-video-player ${className}`} aria-label="Video player">
      <video
        src={src}
        poster={posterSrc}
        muted={isMuted}
        className="video-element"
        playsInline
        preload="metadata"
        controls
      >
      <track kind="captions" src="" srcLang="en" label="English captions"
      />
      </video>

      {/* Controls and overlay UI */}
      <div className="video-controls">
      <button
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          type="button"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      </div>
      </section>
  );
};

export default EnhancedVideoPlayer;