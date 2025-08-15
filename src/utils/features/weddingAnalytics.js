// Advanced analytics for wedding website engagement
export class WeddingAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.events = [];
    this.setupEventTracking();
  }

  generateSessionId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Track specific wedding website interactions
  trackEvent(eventName, properties = {}) {
    const event = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      eventName,
      properties: {
        ...properties,
        url: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      },
    };

    this.events.push(event);
    this.sendToAnalytics(event);
  }

  // Wedding-specific event tracking
  trackPhotoView(photoId, photoCategory) {
    this.trackEvent('photo_viewed', {
      photoId,
      photoCategory,
      viewDuration: this.calculateViewDuration(),
    });
  }

  trackGuestbookEntry(entryLength, hasImage) {
    this.trackEvent('guestbook_entry', {
      messageLength: entryLength,
      includesImage: hasImage,
      device: this.getDeviceType(),
    });
  }

  trackMemoryUpload(fileType, fileSize) {
    this.trackEvent('memory_uploaded', {
      fileType,
      fileSizeMB: Math.round(fileSize / (1024 * 1024)),
      uploadMethod: 'drag_drop_or_click',
    });
  }

  trackSectionEngagement(sectionName, timeSpent) {
    this.trackEvent('section_engagement', {
      sectionName,
      timeSpentSeconds: Math.round(timeSpent / 1000),
      engagementLevel: this.calculateEngagementLevel(timeSpent),
    });
  }

  // User behavior insights
  trackScrollDepth() {
    const scrollPercentage =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

    if (scrollPercentage > 25 && !this.milestones?.scroll25) {
      this.trackEvent('scroll_milestone', { percentage: 25 });
      this.milestones = { ...this.milestones, scroll25: true };
    }
    if (scrollPercentage > 50 && !this.milestones?.scroll50) {
      this.trackEvent('scroll_milestone', { percentage: 50 });
      this.milestones = { ...this.milestones, scroll50: true };
    }
    if (scrollPercentage > 75 && !this.milestones?.scroll75) {
      this.trackEvent('scroll_milestone', { percentage: 75 });
      this.milestones = { ...this.milestones, scroll75: true };
    }
    if (scrollPercentage > 90 && !this.milestones?.scroll90) {
      this.trackEvent('scroll_milestone', { percentage: 90 });
      this.milestones = { ...this.milestones, scroll90: true };
    }
  }

  // Setup automatic event tracking
  setupEventTracking() {
    this.milestones = {};

    // Scroll tracking
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => this.trackScrollDepth(), 100);
    });

    // Time on page tracking
    window.addEventListener('beforeunload', () => {
      const timeOnSite = Date.now() - this.startTime;
      this.trackEvent('session_end', {
        sessionDurationMinutes: Math.round(timeOnSite / 60000),
        totalEvents: this.events.length,
        bounceRate: this.events.length <= 1 ? 'true' : 'false',
      });
    });

    // Error tracking
    window.addEventListener('error', (error) => {
      this.trackEvent('javascript_error', {
        message: error.message,
        filename: error.filename,
        lineNumber: error.lineno,
        columnNumber: error.colno,
      });
    });

    // Click tracking for important elements
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btn, .nav-link, .photo, .memory-item')) {
        this.trackEvent('element_click', {
          elementType: e.target.className,
          elementText: e.target.textContent?.substring(0, 100),
          elementId: e.target.id,
        });
      }
    });
  }

  // Utility methods
  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  calculateEngagementLevel(timeSpent) {
    const seconds = timeSpent / 1000;
    if (seconds < 5) return 'low';
    if (seconds < 30) return 'medium';
    if (seconds < 120) return 'high';
    return 'very_high';
  }

  calculateViewDuration() {
    return Date.now() - this.startTime;
  }

  // Send events to analytics service
  async sendToAnalytics(event) {
    try {
      // Send to your analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      // Also send key events to Google Analytics if available
      if (window.gtag && this.isKeyEvent(event.eventName)) {
        window.gtag('event', event.eventName, {
          custom_parameter_1: event.properties.photoCategory || event.properties.sectionName,
          value: event.properties.timeSpentSeconds || 1,
        });
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  isKeyEvent(eventName) {
    const keyEvents = ['photo_viewed', 'guestbook_entry', 'memory_uploaded', 'scroll_milestone'];
    return keyEvents.includes(eventName);
  }

  // Generate insights report
  generateInsights() {
    const photoViews = this.events.filter((e) => e.eventName === 'photo_viewed');
    const guestbookEntries = this.events.filter((e) => e.eventName === 'guestbook_entry');
    const memoryUploads = this.events.filter((e) => e.eventName === 'memory_uploaded');

    return {
      sessionSummary: {
        sessionId: this.sessionId,
        duration: Date.now() - this.startTime,
        totalEvents: this.events.length,
        deviceType: this.getDeviceType(),
      },
      engagement: {
        photosViewed: photoViews.length,
        guestbookEntries: guestbookEntries.length,
        memoriesUploaded: memoryUploads.length,
        mostViewedPhotoCategory: this.getMostViewedCategory(photoViews),
      },
    };
  }

  getMostViewedCategory(photoViews) {
    const categories = {};
    photoViews.forEach((view) => {
      const category = view.properties.photoCategory;
      categories[category] = (categories[category] || 0) + 1;
    });

    return Object.keys(categories).reduce((a, b) => (categories[a] > categories[b] ? a : b), null);
  }
}

// Initialize analytics
export const analytics = new WeddingAnalytics();
