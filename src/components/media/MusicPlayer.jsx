import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './MusicPlayer.css';

const MusicPlayer = ({ isEnabled = false, position = 'bottom-right' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Playlist - use real music files from /audio/
  const playlist = [
    {
      title: 'First Time (Acoustic)',
      artist: 'Custom Upload',
      src: '/audio/first-time-acoustic.mp3',
    },
    // Add more tracks here as needed
  ];

  useEffect(() => {
    if (isEnabled && audioRef.current && typeof window !== 'undefined') {
      // Auto-start music when enabled (only in browser environment)
      try {
        if (typeof audioRef.current.volume === 'number') {
          audioRef.current.volume = volume;
        }
        if (typeof audioRef.current.play === 'function') {
          const playPromise = audioRef.current.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
              // Ignore play errors (e.g., user interaction required)
            });
          }
        }
        setIsPlaying(true);
      } catch (error) {
        // Handle errors in test environments or unsupported browsers
        console.warn('Audio playback not supported in this environment', error.message);
        setIsPlaying(false);
      }
    }
  }, [isEnabled, volume]);

  const nextTrack = React.useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  }, [playlist.length]);

  const prevTrack = React.useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  }, [playlist.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, playlist.length, nextTrack]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isEnabled) return null;

  return (
    <div className={`music-player ${position} ${isMinimized ? 'minimized' : ''}`}>
      <audio ref={audioRef} src={playlist[currentTrack]?.src} preload="metadata">
        <track kind="captions" src="" label="No captions available" default />
      </audio>

      {isMinimized ? (
        <button
          className="expand-button"
          onClick={() => setIsMinimized(false)}
          aria-label="Expand music player"
        >
          🎵
        </button>
      ) : (
        <div className="player-content">
          <div className="player-header">
            <div className="track-info">
              <div className="track-title">{playlist[currentTrack]?.title}</div>
              <div className="track-artist">{playlist[currentTrack]?.artist}</div>
            </div>
            <button
              className="minimize-button"
              onClick={() => setIsMinimized(true)}
              aria-label="Minimize music player"
            >
              −
            </button>
          </div>

          <div className="player-progress">
            <span className="time-current">{formatTime(currentTime)}</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="time-duration">{formatTime(duration)}</span>
          </div>

          <div className="player-controls">
            <button onClick={prevTrack} aria-label="Previous track">
              ⏮
            </button>
            <button
              onClick={() => {
                if (isPlaying) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                } else {
                  audioRef.current.play();
                  setIsPlaying(true);
                }
              }}
              className="play-pause-btn"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶️'}
            </button>
            <button onClick={nextTrack} aria-label="Next track">
              ⏭
            </button>
          </div>

          <div className="volume-control">
            <span>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              aria-label="Volume control"
            />
          </div>
        </div>
      )}
    </div>
  );
};

MusicPlayer.propTypes = {
  isEnabled: PropTypes.bool,
  position: PropTypes.oneOf(['bottom-right', 'bottom-left', 'top-right', 'top-left']),
};

export default MusicPlayer;
