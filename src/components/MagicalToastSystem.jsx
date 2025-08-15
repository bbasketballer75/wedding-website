'use client';

/**
 * 🎉 MAGICAL TOAST NOTIFICATION SYSTEM ✨
 *
 * Provides beautiful, accessible, and delightful notifications throughout the wedding website.
 * Features: Multiple types, animations, sound effects, accessibility compliance, and magical touches.
 */

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../styles/components/magical-toast.css';

// Toast Types with Magical Themes
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
  LOVE: 'love',
  CELEBRATION: 'celebration',
  MAGIC: 'magic',
};

// Wedding-themed toast messages
export const WEDDING_TOASTS = {
  guestbookSigned: {
    type: TOAST_TYPES.LOVE,
    title: '💕 Love Added!',
    message: 'Your beautiful message has been added to our guestbook',
    duration: 5000,
  },
  photoLiked: {
    type: TOAST_TYPES.CELEBRATION,
    title: '📸 Photo Loved!',
    message: 'Thank you for sharing the love on this memory',
    duration: 3000,
  },
  welcomeBack: {
    type: TOAST_TYPES.MAGIC,
    title: '✨ Welcome Back!',
    message: 'So happy to see you again on our special journey',
    duration: 4000,
  },
  newGuest: {
    type: TOAST_TYPES.INFO,
    title: '👋 New Guest Joined!',
    message: 'Someone new is celebrating with us',
    duration: 3000,
  },
  galleryShared: {
    type: TOAST_TYPES.SUCCESS,
    title: '📱 Gallery Shared!',
    message: 'Photos shared successfully with friends and family',
    duration: 4000,
  },
  countdownMilestone: {
    type: TOAST_TYPES.CELEBRATION,
    title: '⏰ Countdown Milestone!',
    message: 'Getting closer to our big day',
    duration: 5000,
  },
  rsvpSubmitted: {
    type: TOAST_TYPES.LOVE,
    title: '💌 RSVP Received!',
    message: "Thank you for letting us know you'll be there",
    duration: 6000,
  },
};

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const timeoutRef = useRef();
  const removeTimeoutRef = useRef();

  useEffect(() => {
    // Show animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto-remove timer
    if (toast.duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleRemove();
      }, toast.duration);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(timeoutRef.current);
      clearTimeout(removeTimeoutRef.current);
    };
  }, [toast.duration]);

  const handleRemove = useCallback(() => {
    setIsRemoving(true);
    setIsVisible(false);

    removeTimeoutRef.current = setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  }, [toast.id, onRemove]);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
  };

  const handleMouseLeave = () => {
    if (toast.duration > 0) {
      timeoutRef.current = setTimeout(handleRemove, 1000);
    }
  };

  const getToastIcon = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return '✅';
      case TOAST_TYPES.ERROR:
        return '❌';
      case TOAST_TYPES.INFO:
        return 'ℹ️';
      case TOAST_TYPES.WARNING:
        return '⚠️';
      case TOAST_TYPES.LOVE:
        return '💕';
      case TOAST_TYPES.CELEBRATION:
        return '🎉';
      case TOAST_TYPES.MAGIC:
        return '✨';
      default:
        return '💫';
    }
  };

  return (
    <div
      className={`magical-toast magical-toast--${toast.type} ${isVisible ? 'magical-toast--visible' : ''} ${isRemoving ? 'magical-toast--removing' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="magical-toast__content">
        <div className="magical-toast__icon">{getToastIcon()}</div>
        <div className="magical-toast__text">
          {toast.title && <div className="magical-toast__title">{toast.title}</div>}
          <div className="magical-toast__message">{toast.message}</div>
        </div>
        <button
          className="magical-toast__close"
          onClick={handleRemove}
          aria-label="Close notification"
          type="button"
        >
          ×
        </button>
      </div>

      {toast.duration > 0 && (
        <div
          className="magical-toast__progress"
          style={{
            animationDuration: `${toast.duration}ms`,
            animationPlayState: isRemoving ? 'paused' : 'running',
          }}
        />
      )}

      {/* Magical sparkles for special toasts */}
      {(toast.type === TOAST_TYPES.LOVE ||
        toast.type === TOAST_TYPES.CELEBRATION ||
        toast.type === TOAST_TYPES.MAGIC) && (
        <div className="magical-toast__sparkles">
          <span className="sparkle">✨</span>
          <span className="sparkle">💫</span>
          <span className="sparkle">⭐</span>
        </div>
      )}
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div
      className="magical-toast-container"
      aria-live="polite"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const addToast = useCallback((toastData) => {
    const toast = {
      id: nextId.current++,
      type: TOAST_TYPES.INFO,
      duration: 4000,
      ...toastData,
      timestamp: Date.now(),
    };

    setToasts((prev) => [...prev, toast]);

    // Play sound effect for magical toasts
    if (
      toast.type === TOAST_TYPES.LOVE ||
      toast.type === TOAST_TYPES.CELEBRATION ||
      toast.type === TOAST_TYPES.MAGIC
    ) {
      playToastSound(toast.type);
    }

    return toast.id;
  }, []);

  const removeToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Wedding-specific toast shortcuts
  const showWeddingToast = useCallback(
    (toastKey, customData = {}) => {
      const weddingToast = WEDDING_TOASTS[toastKey];
      if (weddingToast) {
        return addToast({ ...weddingToast, ...customData });
      }
      return null;
    },
    [addToast]
  );

  const showSuccess = useCallback(
    (message, title = 'Success!') => {
      return addToast({
        type: TOAST_TYPES.SUCCESS,
        title,
        message,
      });
    },
    [addToast]
  );

  const showError = useCallback(
    (message, title = 'Oops!') => {
      return addToast({
        type: TOAST_TYPES.ERROR,
        title,
        message,
        duration: 6000,
      });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message, title = 'Info') => {
      return addToast({
        type: TOAST_TYPES.INFO,
        title,
        message,
      });
    },
    [addToast]
  );

  const showLove = useCallback(
    (message, title = '💕 Love!') => {
      return addToast({
        type: TOAST_TYPES.LOVE,
        title,
        message,
        duration: 5000,
      });
    },
    [addToast]
  );

  const showCelebration = useCallback(
    (message, title = '🎉 Celebration!') => {
      return addToast({
        type: TOAST_TYPES.CELEBRATION,
        title,
        message,
        duration: 4000,
      });
    },
    [addToast]
  );

  // Auto-cleanup old toasts
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setToasts((prev) =>
        prev.filter(
          (toast) => now - toast.timestamp < 30000 // Remove toasts older than 30 seconds
        )
      );
    }, 5000);

    return () => clearInterval(cleanup);
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showWeddingToast,
    showSuccess,
    showError,
    showInfo,
    showLove,
    showCelebration,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Sound effect helper
const playToastSound = (type) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different tones for different toast types
    switch (type) {
      case TOAST_TYPES.LOVE:
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.exponentialRampToValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        break;
      case TOAST_TYPES.CELEBRATION:
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
        oscillator.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.1); // G5
        break;
      case TOAST_TYPES.MAGIC:
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime); // G5
        oscillator.frequency.exponentialRampToValueAtTime(1046.5, audioContext.currentTime + 0.1); // C6
        break;
      default:
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
    }

    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    // Silently fail if audio context isn't available
    console.debug('Toast sound effect not available:', error);
  }
};

// Hook for easy wedding toast usage
export const useWeddingToasts = () => {
  const { showWeddingToast, showLove, showCelebration } = useToast();

  return {
    guestbookSigned: () => showWeddingToast('guestbookSigned'),
    photoLiked: () => showWeddingToast('photoLiked'),
    welcomeBack: () => showWeddingToast('welcomeBack'),
    newGuest: () => showWeddingToast('newGuest'),
    galleryShared: () => showWeddingToast('galleryShared'),
    countdownMilestone: () => showWeddingToast('countdownMilestone'),
    rsvpSubmitted: () => showWeddingToast('rsvpSubmitted'),
    showLove,
    showCelebration,
  };
};

export default ToastProvider;
