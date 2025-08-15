'use client';

import { useEffect } from 'react';

/**
 * Client-side feature initialization component
 * Handles the setup of all advanced features on app load
 */
export default function FeatureInitializer() {
  useEffect(() => {
    // Dynamically import and initialize features only on client side
    const initializeFeatures = async () => {
      try {
        // Dynamic imports to avoid SSR issues
        const { featureManager } = await import('../services/featureManager');
        const { privacyManager } = await import('../services/privacyManager');

        // Initialize feature management system
        featureManager.init();

        // Initialize privacy compliance system
        privacyManager.init();
      } catch (error) {
        console.warn('⚠️ Feature initialization failed:', error);
        // Continue without advanced features for graceful degradation
      }
    };

    initializeFeatures();
  }, []);

  // This component renders nothing - it's only for initialization
  return null;
}
