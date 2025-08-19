'use client';

/**
 * 🎉 MAGICAL TOAST NOTIFICATION SYSTEM ✨
 *
 * Provides beautiful, accessible, and delightful notifications throughout the wedding website.
 * Features: Multiple types, animations, sound effects, accessibility compliance, and magical touches.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// Toast Types with Magical Themes
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
  LOVE: 'love',
  CELEBRATION: 'celebration',
  MAGIC: 'magic',
} as const;

export type ToastType = (typeof TOAST_TYPES)[keyof typeof TOAST_TYPES];

export interface ToastData {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration: number;
  timestamp: number;
}

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
} as const;

interface ToastContextType {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id' | 'timestamp'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  showWeddingToast: (key: keyof typeof WEDDING_TOASTS) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showLove: (message: string, title?: string) => void;
  showCelebration: (message: string, title?: string) => void;
}

// Toast Context
const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

// Individual Toast Component
const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRemove = useCallback(() => {
    setIsRemoving(true);
    removeTimeoutRef.current = setTimeout(() => {
      onRemove(toast.id);
    }, 300); // Animation duration
  }, [toast.id, onRemove]);

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
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (removeTimeoutRef.current) clearTimeout(removeTimeoutRef.current);
    };
  }, [toast.duration, handleRemove]);

  const handleMouseEnter = useCallback(() => {
    if (toast.duration > 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [toast.duration]);

  const handleMouseLeave = useCallback(() => {
    if (toast.duration > 0) {
      timeoutRef.current = setTimeout(handleRemove, 1000); // Continue countdown
    }
  }, [toast.duration, handleRemove]);

  const getToastIcon = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return '✅';
      case TOAST_TYPES.ERROR:
        return '❌';
      case TOAST_TYPES.WARNING:
        return '⚠️';
      case TOAST_TYPES.INFO:
        return 'ℹ️';
      case TOAST_TYPES.LOVE:
        return '💕';
      case TOAST_TYPES.CELEBRATION:
        return '🎉';
      case TOAST_TYPES.MAGIC:
        return '✨';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div
      className={`magical-toast magical-toast--${toast.type} ${isVisible ? 'magical-toast--visible' : ''} ${isRemoving ? 'magical-toast--removing' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live="polite"
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

      {/* Progress bar for auto-dismiss */}
      {toast.duration > 0 && (
        <div
          className="magical-toast__progress"
          style={{
            animationDuration: `${toast.duration}ms`,
            animationPlayState: isRemoving ? 'paused' : 'running',
          }}
        />
      )}

      {/* Magical particles for special toast types */}
      {(toast.type === TOAST_TYPES.LOVE ||
        toast.type === TOAST_TYPES.CELEBRATION ||
        toast.type === TOAST_TYPES.MAGIC) && (
        <div className="magical-toast__particles">
          {[...Array(6)].map((_, i) => (
            <div
              key={`${toast.id}-particle-${i}`}
              className={`magical-toast__particle magical-toast__particle--${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastData[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => (
  <section className="magical-toast-container" aria-live="polite" aria-label="Notifications">
    {toasts.map((toast) => (
      <Toast key={toast.id} toast={toast} onRemove={removeToast} />
    ))}
  </section>
);

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Generate unique ID for toasts
  const generateId = useCallback((): string => {
    return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }, []);

  // Add a new toast
  const addToast = useCallback(
    (toastData: Omit<ToastData, 'id' | 'timestamp'>): string => {
      const id = generateId();
      const timestamp = Date.now();

      const newToast: ToastData = {
        ...toastData,
        id,
        timestamp,
      };

      setToasts((prev) => {
        // Limit to 5 toasts maximum
        const updatedToasts = [newToast, ...prev].slice(0, 5);
        return updatedToasts;
      });

      return id;
    },
    [generateId]
  );

  // Remove a specific toast
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Clear all toasts
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Cleanup old toasts periodically
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

  // Convenience methods for different toast types
  const showWeddingToast = useCallback(
    (key: keyof typeof WEDDING_TOASTS) => {
      const weddingToast = WEDDING_TOASTS[key];
      addToast(weddingToast);
    },
    [addToast]
  );

  const showSuccess = useCallback(
    (message: string, title?: string) => {
      addToast({
        type: TOAST_TYPES.SUCCESS,
        message,
        title,
        duration: 4000,
      });
    },
    [addToast]
  );

  const showError = useCallback(
    (message: string, title?: string) => {
      addToast({
        type: TOAST_TYPES.ERROR,
        message,
        title,
        duration: 6000,
      });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message: string, title?: string) => {
      addToast({
        type: TOAST_TYPES.INFO,
        message,
        title,
        duration: 4000,
      });
    },
    [addToast]
  );

  const showLove = useCallback(
    (message: string, title?: string) => {
      addToast({
        type: TOAST_TYPES.LOVE,
        message,
        title,
        duration: 5000,
      });
    },
    [addToast]
  );

  const showCelebration = useCallback(
    (message: string, title?: string) => {
      addToast({
        type: TOAST_TYPES.CELEBRATION,
        message,
        title,
        duration: 5000,
      });
    },
    [addToast]
  );

  const value = useMemo<ToastContextType>(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
