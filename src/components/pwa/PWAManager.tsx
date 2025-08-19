'use client';


import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

// Simplified types
type NotificationPermission = 'default' | 'granted' | 'denied';

interface SyncItem {
  id: string;
  action: string;
  data?: unknown;
}

interface NotificationPayload {
  title: string;
  data: unknown;
  icon?: string;
  badge?: string;
  body?: string;
}

interface PWAState {
  isOnline: boolean;
  isInstallable: boolean;
  notificationPermission: NotificationPermission;
  syncQueue: SyncItem[];
  requestNotificationPermission: () => Promise<NotificationPermission>;
  showNotification: (payload: NotificationPayload) => void;
  addToSyncQueue: (item: SyncItem) => void;
  installApp: () => void;
}

// Context
const PWAContext = createContext<PWAState | null>(null);

export const usePWA = (): PWAState => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

interface PWAProviderProps {
  children: React.ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const [isOnline] = useState(true);
  const [isInstallable] = useState(false);
  const [notificationPermission] = useState<NotificationPermission>('default');
  const [syncQueue] = useState<SyncItem[]>([]);

  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    return 'denied';
  }, []);

  const showNotification = useCallback((_payload: NotificationPayload) => {
    // Simplified - no actual notification shown
  }, []);

  const addToSyncQueue = useCallback((_item: SyncItem) => {
    // Simplified - no actual sync queue management
  }, []);

  const installApp = useCallback(() => {
    // Simplified - no actual installation
  }, []);

  const value: PWAState = useMemo(
    () => ({
      isOnline,
      isInstallable,
      notificationPermission,
      syncQueue,
      requestNotificationPermission,
      showNotification,
      addToSyncQueue,
      installApp,
    }),
    [
      isOnline,
      isInstallable,
      notificationPermission,
      syncQueue,
      requestNotificationPermission,
      showNotification,
      addToSyncQueue,
      installApp,
    ]
  );

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>;
};

// Simplified PWA Components
export const PWAInstallBanner: React.FC = () => null;
export const OfflineStatusIndicator: React.FC = () => null;
export const NotificationManager: React.FC = () => null;

export default PWAProvider;