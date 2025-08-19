'use client';

/**
 * 🎵 Advanced Audio Provider
 * 
 * Comprehensive audio management for wedding website:
 * - Background music control
 * - Multiple audio sources
 * - Volume management
 * - Playlist functionality
 * - Audio visualization
 * - Accessibility features
 */

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useAnalytics } from '@/providers/AnalyticsProvider';

interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  duration?: number;
  album?: string;
  artwork?: string;
}

interface AudioContextType {
  // Playback state
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  
  // Playlist
  playlist: AudioTrack[];
  currentIndex: number;
  
  // Controls
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  
  // Playlist management
  setPlaylist: (tracks: AudioTrack[]) => void;
  addTrack: (track: AudioTrack) => void;
  removeTrack: (trackId: string) => void;
  playTrack: (trackId: string) => void;
  
  // Settings
  isAutoplay: boolean;
  toggleAutoplay: () => void;
  isShuffled: boolean;
  toggleShuffle: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [playlist, setPlaylistState] = useState<AudioTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isShuffled, setIsShuffled] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const analytics = useAnalytics();

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    // Audio event listeners
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (isAutoplay) {
        next();
      }
    };

    const handleError = (e: unknown) => {
      console.error('Audio error:', e);
      analytics.trackEvent({
        action: 'audio_error',
        category: 'audio',
        label: currentTrack?.title || 'unknown'
      });
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      if (audio) {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.pause();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Load default wedding playlist
  useEffect(() => {
    const defaultPlaylist: AudioTrack[] = [
      {
        id: 'wedding-march',
        title: 'Wedding March',
        artist: 'Felix Mendelssohn',
        src: '/audio/wedding-march.mp3',
        artwork: '/images/classical-wedding.jpg'
      },
      {
        id: 'canon-in-d',
        title: 'Canon in D',
        artist: 'Johann Pachelbel',
        src: '/audio/canon-in-d.mp3',
        artwork: '/images/classical-wedding.jpg'
      },
      {
        id: 'our-song',
        title: 'Our Special Song',
        artist: 'Wedding Couple',
        src: '/audio/our-special-song.mp3',
        artwork: '/images/couple-photo.jpg'
      }
    ];

    setPlaylistState(defaultPlaylist);
    setCurrentTrack(defaultPlaylist[0]);
  }, []);

  const play = useCallback(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        analytics.trackWeddingAction('music_play', {
          track: currentTrack.title,
          artist: currentTrack.artist
        });
      }).catch((error) => {
        console.error('Play failed:', error);
        analytics.trackEvent({
          action: 'play_failed',
          category: 'audio',
          label: currentTrack.title
        });
      });
    }
  }, [currentTrack, analytics]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      analytics.trackWeddingAction('music_pause', {
        track: currentTrack?.title
      });
    }
  }, [currentTrack, analytics]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      analytics.trackWeddingAction('music_stop');
    }
  }, [analytics]);

  const next = useCallback(() => {
    if (playlist.length === 0) return;

    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }

    setCurrentIndex(nextIndex);
    setCurrentTrack(playlist[nextIndex]);
    
    if (audioRef.current) {
      audioRef.current.src = playlist[nextIndex].src;
      if (isPlaying) {
        play();
      }
    }

    analytics.trackWeddingAction('music_next', {
      from: currentTrack?.title,
      to: playlist[nextIndex].title
    });
  }, [playlist, currentIndex, isShuffled, isPlaying, currentTrack, play, analytics]);

  const previous = useCallback(() => {
    if (playlist.length === 0) return;

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
    setCurrentIndex(prevIndex);
    setCurrentTrack(playlist[prevIndex]);
    
    if (audioRef.current) {
      audioRef.current.src = playlist[prevIndex].src;
      if (isPlaying) {
        play();
      }
    }

    analytics.trackWeddingAction('music_previous', {
      from: currentTrack?.title,
      to: playlist[prevIndex].title
    });
  }, [playlist, currentIndex, isPlaying, currentTrack, play, analytics]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    localStorage.setItem('wedding-audio-volume', clampedVolume.toString());
    
    analytics.trackWeddingAction('volume_change', {
      volume: clampedVolume
    });
  }, [analytics]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      analytics.trackWeddingAction('audio_mute_toggle', {
        muted: newMuted
      });
      return newMuted;
    });
  }, [analytics]);

  const setPlaylist = useCallback((tracks: AudioTrack[]) => {
    setPlaylistState(tracks);
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
      setCurrentIndex(0);
      if (audioRef.current) {
        audioRef.current.src = tracks[0].src;
      }
    }
  }, []);

  const addTrack = useCallback((track: AudioTrack) => {
    setPlaylistState(prev => [...prev, track]);
    analytics.trackWeddingAction('track_added', {
      track: track.title,
      artist: track.artist
    });
  }, [analytics]);

  const removeTrack = useCallback((trackId: string) => {
    setPlaylistState(prev => {
      const newPlaylist = prev.filter(track => track.id !== trackId);
      const removedTrack = prev.find(track => track.id === trackId);
      
      if (removedTrack) {
        analytics.trackWeddingAction('track_removed', {
          track: removedTrack.title
        });
      }
      
      return newPlaylist;
    });
  }, [analytics]);

  const playTrack = useCallback((trackId: string) => {
    const trackIndex = playlist.findIndex(track => track.id === trackId);
    if (trackIndex !== -1) {
      setCurrentIndex(trackIndex);
      setCurrentTrack(playlist[trackIndex]);
      
      if (audioRef.current) {
        audioRef.current.src = playlist[trackIndex].src;
        play();
      }
      
      analytics.trackWeddingAction('track_selected', {
        track: playlist[trackIndex].title
      });
    }
  }, [playlist, play, analytics]);

  const toggleAutoplay = useCallback(() => {
    setIsAutoplay(prev => {
      const newAutoplay = !prev;
      localStorage.setItem('wedding-audio-autoplay', newAutoplay.toString());
      analytics.trackWeddingAction('autoplay_toggle', {
        enabled: newAutoplay
      });
      return newAutoplay;
    });
  }, [analytics]);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => {
      const newShuffled = !prev;
      analytics.trackWeddingAction('shuffle_toggle', {
        enabled: newShuffled
      });
      return newShuffled;
    });
  }, [analytics]);

  // Load saved settings
  useEffect(() => {
    const savedVolume = localStorage.getItem('wedding-audio-volume');
    if (savedVolume) {
      setVolumeState(parseFloat(savedVolume));
    }

    const savedAutoplay = localStorage.getItem('wedding-audio-autoplay');
    if (savedAutoplay) {
      setIsAutoplay(savedAutoplay === 'true');
    }
  }, []);

  // Update current track when playlist or index changes
  useEffect(() => {
    if (playlist.length > 0 && playlist[currentIndex]) {
      const track = playlist[currentIndex];
      setCurrentTrack(track);
      
      if (audioRef.current) {
        audioRef.current.src = track.src;
      }
    }
  }, [playlist, currentIndex]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentTrack,
        currentTime,
        duration,
        volume,
        isMuted,
        playlist,
        currentIndex,
        play,
        pause,
        stop,
        next,
        previous,
        seek,
        setVolume,
        toggleMute,
        setPlaylist,
        addTrack,
        removeTrack,
        playTrack,
        isAutoplay,
        toggleAutoplay,
        isShuffled,
        toggleShuffle
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

export default AudioProvider;