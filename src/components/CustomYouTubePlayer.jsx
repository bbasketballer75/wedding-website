import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import '../CustomYouTubePlayer.css';

const CustomYouTubePlayer = ({ videoId = 'ZOIRb_ghdh0' }) => {
  const playerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);

  // Your wedding video chapters
  const chapters = [
    { time: 0, title: 'Start' },
    { time: 44, title: 'Bachelor+ette Weekend' },
    { time: 300, title: 'Who Is It Gameshow' },
    { time: 863, title: 'Words From Our Wedding Party' },
    { time: 1211, title: 'Our Vows' },
    { time: 1537, title: 'The Ceremony' },
    { time: 1688, title: 'The Reception' },
    { time: 1814, title: 'First Dance' },
    { time: 2165, title: 'Behind The Scenes & Bloopers' },
    { time: 2375, title: 'The REAL Party' },
    { time: 2643, title: 'Thank You' },
    { time: 2683, title: 'One Final Clip...' },
  ];

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, []);

  const initPlayer = () => {
    const playerInstance = new window.YT.Player(playerRef.current, {
      videoId: videoId,
      width: '100%',
      height: '100%',
      playerVars: {
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        controls: 0,
        fs: 1,
        cc_load_policy: 1,
        iv_load_policy: 3,
        autohide: 1,
      },
      events: {
        onReady: (event) => {
          setPlayer(event.target);
          startTimeUpdater(event.target);
        },
        onStateChange: (event) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
        },
      },
    });
    return playerInstance;
  };

  const startTimeUpdater = (playerInstance) => {
    const updateTime = () => {
      if (playerInstance && playerInstance.getCurrentTime) {
        const time = playerInstance.getCurrentTime();
        setCurrentTime(time);

        // Update active chapter
        const currentChapter = chapters.findIndex((chapter, index) => {
          const nextChapter = chapters[index + 1];
          return time >= chapter.time && (!nextChapter || time < nextChapter.time);
        });
        setActiveChapter(currentChapter !== -1 ? currentChapter : 0);
      }
      requestAnimationFrame(updateTime);
    };
    updateTime();
  };

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleChapterClick = (time) => {
    if (player) {
      player.seekTo(time, true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFullscreen = () => {
    if (player && player.getIframe) {
      const iframe = player.getIframe();
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      }
    }
  };

  return (
    <div className="custom-youtube-player">
      <div className="video-container">
        <div ref={playerRef} className="youtube-player"></div>

        {/* Custom Controls */}
        <div className="custom-controls">
          <button
            className="play-pause-btn"
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>

          <span className="time-display">{formatTime(currentTime)}</span>

          <button className="fullscreen-btn" onClick={handleFullscreen} aria-label="Fullscreen">
            ⛶
          </button>
        </div>
      </div>

      {/* Chapter List */}
      <div className="chapters-list">
        <h3>Wedding Video Chapters</h3>
        <div className="chapters-grid">
          {chapters.map((chapter) => (
            <button
              key={`chapter-${chapter.time}-${chapter.title}`}
              className={`chapter-item ${chapters.findIndex((c) => c.time === chapter.time) === activeChapter ? 'active' : ''}`}
              onClick={() => handleChapterClick(chapter.time)}
            >
              <span className="chapter-time">{formatTime(chapter.time)}</span>
              <span className="chapter-title">{chapter.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

CustomYouTubePlayer.propTypes = {
  videoId: PropTypes.string,
};

export default CustomYouTubePlayer;
