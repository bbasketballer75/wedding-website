// Privacy Compliance Manager - GDPR/CCPA Ready
import { analyticsManager } from './analyticsManager';

class PrivacyManager {
  constructor() {
    this.consent = {
      analytics: false,
      functional: true, // Always true for core functionality
      marketing: false,
      personalization: false,
    };
    this.userPreferences = {};
    this.initialized = false;
    this.storageKey = 'wedding-privacy-consent';
  }

  // Initialize privacy system
  init() {
    if (this.initialized || typeof window === 'undefined') return;

    this.loadStoredConsent();
    this.setupConsentBanner();
    this.setupDataRequestHandlers();
    this.initialized = true;
  }

  // Load stored consent preferences
  loadStoredConsent() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.consent = { ...this.consent, ...data.consent };
        this.userPreferences = data.preferences || {};

        // Apply consent settings
        this.applyConsentSettings();
      } else {
        // First time visitor - show consent banner
        this.showConsentBanner();
      }
    } catch (error) {
      console.warn('Failed to load privacy consent:', error);
      this.showConsentBanner();
    }
  }

  // Save consent preferences
  saveConsent() {
    try {
      const data = {
        consent: this.consent,
        preferences: this.userPreferences,
        timestamp: Date.now(),
        version: '1.0',
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      this.applyConsentSettings();

      analyticsManager.trackEvent('privacy_consent_updated', {
        consent: this.consent,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Failed to save privacy consent:', error);
    }
  }

  // Apply consent settings to services
  applyConsentSettings() {
    // Analytics consent
    if (this.consent.analytics && !analyticsManager.isInitialized) {
      analyticsManager.init();
    } else if (!this.consent.analytics && analyticsManager.isInitialized) {
      // Disable analytics tracking
      this.disableAnalytics();
    }

    // Update tracking scripts
    this.updateTrackingScripts();
  }

  // Disable analytics if consent withdrawn
  disableAnalytics() {
    // Clear analytics data
    try {
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
    } catch (error) {
      console.warn('Failed to disable analytics:', error);
    }
  }

  // Update tracking scripts based on consent
  updateTrackingScripts() {
    // Google Analytics consent mode
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        analytics_storage: this.consent.analytics ? 'granted' : 'denied',
        ad_storage: this.consent.marketing ? 'granted' : 'denied',
        personalization_storage: this.consent.personalization ? 'granted' : 'denied',
      });
    }
  }

  // Show consent banner
  showConsentBanner() {
    if (document.getElementById('privacy-consent-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'privacy-consent-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        border-top: 1px solid #e0e0e0;
        padding: 1.5rem;
        z-index: 10000;
        box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
        font-family: var(--font-body, system-ui);
      ">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px;">
              <h3 style="margin: 0 0 0.5rem 0; color: var(--sage-green, #8B9A8B); font-size: 1.1rem;">
                🍃 We respect your privacy
              </h3>
              <p style="margin: 0; color: #666; font-size: 0.9rem; line-height: 1.4;">
                We use cookies and similar technologies to enhance your experience on our wedding website. 
                You can choose which types of data we collect.
              </p>
            </div>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <button onclick="privacyManager.showPreferences()" style="
                background: transparent;
                border: 2px solid var(--sage-green, #8B9A8B);
                color: var(--sage-green, #8B9A8B);
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                font-size: 0.9rem;
              ">
                Customize
              </button>
              <button onclick="privacyManager.acceptAll()" style="
                background: var(--sage-green, #8B9A8B);
                border: 2px solid var(--sage-green, #8B9A8B);
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                font-size: 0.9rem;
              ">
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Make privacy manager available globally for button clicks
    window.privacyManager = this;
  }

  // Show detailed preferences modal
  showPreferences() {
    const modal = document.createElement('div');
    modal.id = 'privacy-preferences-modal';
    modal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      ">
        <div style="
          background: white;
          border-radius: 12px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        ">
          <h2 style="margin: 0 0 1.5rem 0; color: var(--sage-green, #8B9A8B);">
            Privacy Preferences
          </h2>
          
          <div style="margin-bottom: 2rem;">
            <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h4 style="margin: 0 0 0.5rem 0;">Essential Cookies</h4>
                  <p style="margin: 0; color: #666; font-size: 0.9rem;">
                    Required for the website to function properly.
                  </p>
                </div>
                <input type="checkbox" checked disabled style="transform: scale(1.2);">
              </div>
            </div>
            
            <div style="margin-bottom: 1.5rem; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h4 style="margin: 0 0 0.5rem 0;">Analytics</h4>
                  <p style="margin: 0; color: #666; font-size: 0.9rem;">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <input type="checkbox" id="analytics-consent" ${this.consent.analytics ? 'checked' : ''} style="transform: scale(1.2);">
              </div>
            </div>
            
            <div style="margin-bottom: 1.5rem; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h4 style="margin: 0 0 0.5rem 0;">Personalization</h4>
                  <p style="margin: 0; color: #666; font-size: 0.9rem;">
                    Customize your experience based on your preferences.
                  </p>
                </div>
                <input type="checkbox" id="personalization-consent" ${this.consent.personalization ? 'checked' : ''} style="transform: scale(1.2);">
              </div>
            </div>
          </div>
          
          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button onclick="privacyManager.closePreferences()" style="
              background: transparent;
              border: 2px solid #ccc;
              color: #666;
              padding: 0.75rem 1.5rem;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
            ">
              Cancel
            </button>
            <button onclick="privacyManager.savePreferences()" style="
              background: var(--sage-green, #8B9A8B);
              border: 2px solid var(--sage-green, #8B9A8B);
              color: white;
              padding: 0.75rem 1.5rem;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
            ">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  // Accept all cookies
  acceptAll() {
    this.consent = {
      analytics: true,
      functional: true,
      marketing: false, // Keep marketing false for wedding site
      personalization: true,
    };
    this.saveConsent();
    this.hideBanner();
  }

  // Save custom preferences
  savePreferences() {
    const analytics = document.getElementById('analytics-consent')?.checked || false;
    const personalization = document.getElementById('personalization-consent')?.checked || false;

    this.consent = {
      ...this.consent,
      analytics,
      personalization,
    };

    this.saveConsent();
    this.closePreferences();
    this.hideBanner();
  }

  // Close preferences modal
  closePreferences() {
    const modal = document.getElementById('privacy-preferences-modal');
    if (modal) {
      modal.remove();
    }
  }

  // Hide consent banner
  hideBanner() {
    const banner = document.getElementById('privacy-consent-banner');
    if (banner) {
      banner.remove();
    }
  }

  // Setup data request handlers
  setupDataRequestHandlers() {
    // This would integrate with your backend for GDPR requests
    window.addEventListener('message', (event) => {
      if (event.data.type === 'privacy-data-request') {
        this.handleDataRequest(event.data.requestType);
      }
    });
  }

  // Handle data requests (export, delete, etc.)
  async handleDataRequest(type) {
    try {
      switch (type) {
        case 'export':
          await this.exportUserData();
          break;
        case 'delete':
          await this.deleteUserData();
          break;
        default:
          console.warn('Unknown data request type:', type);
      }
    } catch (error) {
      console.error('Data request failed:', error);
    }
  }

  // Export user data
  async exportUserData() {
    const userData = {
      consent: this.consent,
      preferences: this.userPreferences,
      timestamp: Date.now(),
      analytics: analyticsManager.events || [],
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-website-data.json';
    a.click();
    URL.revokeObjectURL(url);

    analyticsManager.trackEvent('user_data_exported');
  }

  // Delete user data
  async deleteUserData() {
    // Clear local storage
    localStorage.removeItem(this.storageKey);

    // Reset consent
    this.consent = {
      analytics: false,
      functional: true,
      marketing: false,
      personalization: false,
    };

    // Clear analytics
    if (analyticsManager.events) {
      analyticsManager.events = [];
    }

    analyticsManager.trackEvent('user_data_deleted');

    alert('Your data has been deleted successfully.');
  }

  // Get current consent status
  getConsent() {
    return { ...this.consent };
  }

  // Check if specific consent is granted
  hasConsent(type) {
    return this.consent[type] || false;
  }
}

// Create global instance
export const privacyManager = new PrivacyManager();

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => privacyManager.init());
  } else {
    privacyManager.init();
  }
}

export default privacyManager;
