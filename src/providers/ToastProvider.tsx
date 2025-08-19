'use client';

/**
 * 🎯 Advanced Toast Provider
 * 
 * Beautiful toast notification system:
 * - Multiple toast types
 * - Auto-dismiss functionality
 * - Custom styling
 * - Accessibility features
 * - Position management
 * - Action buttons
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: string;
  persistent?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  
  // Convenience methods
  success: (title: string, message?: string, options?: Partial<Toast>) => string;
  error: (title: string, message?: string, options?: Partial<Toast>) => string;
  warning: (title: string, message?: string, options?: Partial<Toast>) => string;
  info: (title: string, message?: string, options?: Partial<Toast>) => string;
  loading: (title: string, message?: string) => string;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? (toast.type === 'loading' ? 0 : 5000)
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast if not persistent and has duration
    if (!toast.persistent && newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, [removeToast]);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'success',
      title,
      message,
      icon: '✅',
      ...options
    });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'error',
      title,
      message,
      icon: '❌',
      duration: 8000, // Errors stay longer
      ...options
    });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'warning',
      title,
      message,
      icon: '⚠️',
      ...options
    });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'info',
      title,
      message,
      icon: 'ℹ️',
      ...options
    });
  }, [addToast]);

  const loading = useCallback((title: string, message?: string) => {
    return addToast({
      type: 'loading',
      title,
      message,
      icon: '⏳',
      persistent: true,
      duration: 0
    });
  }, [addToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
        success,
        error,
        warning,
        info,
        loading
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast}
      />
      </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

/**
 * Toast Container Component
 */
interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove}
      />
        ))}
      </AnimatePresence>
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 400px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .toast-container {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }
        }
      `}</style>
      </div>
  );
};

/**
 * Individual Toast Item
 */
interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getToastColors = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'linear-gradient(135deg, #4CAF50, #45a049)',
          border: '#4CAF50'
        };
      case 'error':
        return {
          bg: 'linear-gradient(135deg, #f44336, #d32f2f)',
          border: '#f44336'
        };
      case 'warning':
        return {
          bg: 'linear-gradient(135deg, #ff9800, #f57c00)',
          border: '#ff9800'
        };
      case 'info':
        return {
          bg: 'linear-gradient(135deg, #2196F3, #1976D2)',
          border: '#2196F3'
        };
      case 'loading':
        return {
          bg: 'linear-gradient(135deg, #9caf88, #7a8b6c)',
          border: '#9caf88'
        };
      default:
        return {
          bg: 'linear-gradient(135deg, #333, #555)',
          border: '#333'
        };
    }
  };

  const colors = getToastColors(toast.type);

  return (
    <motion.div
      className="toast-item"
      initial={{ opacity: 0, x: 400, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 400, scale: 0.8 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="toast-content">
        {toast.icon && (
          <div className="toast-icon">
            {toast.type === 'loading' ? (
              <div className="loading-spinner"
      />
            ) : (
              toast.icon
            )}
          </div>
        )}
        
        <div className="toast-text">
      <div className="toast-title">{toast.title}</div>
          {toast.message && (
            <div className="toast-message">{toast.message}</div>
          )}
        </div>

        {toast.action && (
          <button
            className="toast-action"
            onClick={toast.action.onClick}
          >
            {toast.action.label}
          </button>
        )}

        <button
          className="toast-close"
          onClick={() => onRemove(toast.id)}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
      <style jsx>{`
        .toast-item {
          background: ${colors.bg};
          color: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid ${colors.border};
          backdrop-filter: blur(10px);
          overflow: hidden;
          max-width: 400px;
        }

        .toast-content {
          display: flex;
          align-items: center;
          padding: 16px;
          gap: 12px;
        }

        .toast-icon {
          font-size: 20px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .toast-text {
          flex: 1;
          min-width: 0;
        }

        .toast-title {
          font-weight: bold;
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 4px;
        }

        .toast-message {
          font-size: 12px;
          opacity: 0.9;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .toast-action {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .toast-action:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .toast-close {
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s ease;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .toast-close:hover {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .toast-content {
            padding: 12px;
            gap: 8px;
          }

          .toast-title {
            font-size: 13px;
          }

          .toast-message {
            font-size: 11px;
          }

          .toast-action {
            padding: 4px 8px;
            font-size: 11px;
          }
        }
      `}</style>
      </motion.div>
  );
};

export default ToastProvider;