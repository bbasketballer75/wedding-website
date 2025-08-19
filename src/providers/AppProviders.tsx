'use client';

/**
 * 🏠 Enhanced AppProviders with PWA Integration
 *
 * Central provider wrapper combining all application contexts:
 * - Audio management
 * - Toast notifications
 * - Error boundaries
 * - Performance monitoring
 * - Analytics
 * - PWA capabilities
 * - AI features
 */

import { AIWeddingProvider } from '@/components/ai/AIWeddingFeatures';
import { AudioProvider as AmbientAudioProvider } from '@/components/AmbientSoundSystem';
import { WebVitalsReporter } from '@/components/performance/WebVitalsReporter';
import {
  NotificationManager,
  OfflineStatusIndicator,
  PWAInstallBanner,
  PWAProvider,
} from '@/components/pwa/PWAManager';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { AnalyticsProvider } from '@/providers/AnalyticsProvider';
import { AudioProvider } from '@/providers/AudioProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import React from 'react';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <PWAProvider>
        <AIWeddingProvider>
          <AnalyticsProvider>
            <AudioProvider>
              <AmbientAudioProvider>
                <ToastProvider>
                  {children}

                  {/* PWA Components */}
                  <PWAInstallBanner />
                  <OfflineStatusIndicator />
                  <NotificationManager />

                  {/* Performance Monitoring */}
                  <WebVitalsReporter />
                </ToastProvider>
              </AmbientAudioProvider>
            </AudioProvider>
          </AnalyticsProvider>
        </AIWeddingProvider>
      </PWAProvider>
    </ErrorBoundary>
  );
};

export default AppProviders;
