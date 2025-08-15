import winston from 'winston';

class MemoryAnalyticsService {
  constructor() {
    this.analytics = {
      photoViews: new Map(),
      guestEngagement: new Map(),
      popularContent: new Map(),
      dailyStats: new Map(),
    };
    this.initializeAnalytics();
  }

  initializeAnalytics() {
    winston.info('Memory Analytics Service initialized for post-wedding site');
  }

  // Track photo views and popularity
  async trackPhotoView(photoId, visitorInfo = {}) {
    try {
      const timestamp = new Date();
      const viewData = {
        photoId,
        timestamp,
        visitorIp: visitorInfo.ip || 'unknown',
        userAgent: visitorInfo.userAgent || 'unknown',
        referrer: visitorInfo.referrer || 'direct',
        sessionId: visitorInfo.sessionId || this.generateSessionId(),
      };

      // Update photo view count
      if (!this.analytics.photoViews.has(photoId)) {
        this.analytics.photoViews.set(photoId, []);
      }
      this.analytics.photoViews.get(photoId).push(viewData);

      // Update daily stats
      const dateKey = timestamp.toISOString().split('T')[0];
      if (!this.analytics.dailyStats.has(dateKey)) {
        this.analytics.dailyStats.set(dateKey, {
          photoViews: 0,
          uniqueVisitors: new Set(),
          guestbookEntries: 0,
          photoUploads: 0,
        });
      }

      const dayStats = this.analytics.dailyStats.get(dateKey);
      dayStats.photoViews++;
      dayStats.uniqueVisitors.add(visitorInfo.ip || 'unknown');

      // Check if photo becomes popular
      await this.checkPhotoPopularity(photoId);

      winston.info(`Photo view tracked: ${photoId}`);
      return { success: true, viewCount: this.getPhotoViewCount(photoId) };
    } catch (error) {
      winston.error('Failed to track photo view:', error);
      return { success: false, error: error.message };
    }
  }

  // Track guestbook interactions
  async trackGuestbookEntry(entryData) {
    try {
      const timestamp = new Date();
      const analyticsData = {
        entryId: entryData.id,
        guestName: entryData.name,
        guestEmail: entryData.email,
        messageLength: entryData.message.length,
        timestamp,
        hasPhoto: !!entryData.photo,
        sentiment: await this.analyzeSentiment(entryData.message),
      };

      if (!this.analytics.guestEngagement.has('guestbook')) {
        this.analytics.guestEngagement.set('guestbook', []);
      }
      this.analytics.guestEngagement.get('guestbook').push(analyticsData);

      // Update daily stats
      const dateKey = timestamp.toISOString().split('T')[0];
      if (this.analytics.dailyStats.has(dateKey)) {
        this.analytics.dailyStats.get(dateKey).guestbookEntries++;
      }

      winston.info(`Guestbook entry tracked: ${entryData.name}`);
      return { success: true, analytics: analyticsData };
    } catch (error) {
      winston.error('Failed to track guestbook entry:', error);
      return { success: false, error: error.message };
    }
  }

  // Track guest photo uploads
  async trackPhotoUpload(uploadData) {
    try {
      const timestamp = new Date();
      const analyticsData = {
        uploadId: uploadData.id,
        uploaderName: uploadData.uploaderName,
        uploaderEmail: uploadData.uploaderEmail,
        photoCount: uploadData.photoCount || 1,
        timestamp,
        status: uploadData.status || 'pending',
      };

      if (!this.analytics.guestEngagement.has('photo-uploads')) {
        this.analytics.guestEngagement.set('photo-uploads', []);
      }
      this.analytics.guestEngagement.get('photo-uploads').push(analyticsData);

      // Update daily stats
      const dateKey = timestamp.toISOString().split('T')[0];
      if (this.analytics.dailyStats.has(dateKey)) {
        this.analytics.dailyStats.get(dateKey).photoUploads += uploadData.photoCount || 1;
      }

      winston.info(
        `Photo upload tracked: ${uploadData.uploaderName}, ${uploadData.photoCount} photos`
      );
      return { success: true };
    } catch (error) {
      winston.error('Failed to track photo upload:', error);
      return { success: false, error: error.message };
    }
  }

  // Get popular photos based on view threshold
  async getPopularPhotos(limit = 10) {
    try {
      const threshold = parseInt(process.env.POPULAR_PHOTOS_THRESHOLD) || 10;
      const popularPhotos = [];

      for (const [photoId, views] of this.analytics.photoViews) {
        if (views.length >= threshold) {
          popularPhotos.push({
            photoId,
            viewCount: views.length,
            uniqueViewers: this.getUniqueViewers(views),
            lastViewed: Math.max(...views.map((v) => v.timestamp.getTime())),
            popularity: this.calculatePopularityScore(views),
          });
        }
      }

      // Sort by popularity score
      popularPhotos.sort((a, b) => b.popularity - a.popularity);

      return popularPhotos.slice(0, limit);
    } catch (error) {
      winston.error('Failed to get popular photos:', error);
      return [];
    }
  }

  // Get guest engagement summary
  async getGuestEngagementSummary() {
    try {
      const guestbookEntries = this.analytics.guestEngagement.get('guestbook') || [];
      const photoUploads = this.analytics.guestEngagement.get('photo-uploads') || [];

      return {
        guestbook: {
          totalEntries: guestbookEntries.length,
          averageMessageLength: this.calculateAverageMessageLength(guestbookEntries),
          sentimentAnalysis: this.calculateSentimentSummary(guestbookEntries),
          entriesWithPhotos: guestbookEntries.filter((e) => e.hasPhoto).length,
        },
        photoUploads: {
          totalUploads: photoUploads.length,
          totalPhotos: photoUploads.reduce((sum, upload) => sum + upload.photoCount, 0),
          uniqueUploaders: new Set(photoUploads.map((u) => u.uploaderEmail)).size,
          averagePhotosPerUpload:
            photoUploads.length > 0
              ? photoUploads.reduce((sum, upload) => sum + upload.photoCount, 0) /
                photoUploads.length
              : 0,
        },
        overall: {
          totalPhotoViews: Array.from(this.analytics.photoViews.values()).reduce(
            (sum, views) => sum + views.length,
            0
          ),
          uniquePhotosViewed: this.analytics.photoViews.size,
          mostActiveDay: this.getMostActiveDay(),
          engagementTrend: this.getEngagementTrend(),
        },
      };
    } catch (error) {
      winston.error('Failed to get engagement summary:', error);
      return {};
    }
  }

  // Get daily analytics report
  async getDailyReport(date = null) {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const dayStats = this.analytics.dailyStats.get(targetDate);

      if (!dayStats) {
        return { date: targetDate, message: 'No data available for this date' };
      }

      return {
        date: targetDate,
        photoViews: dayStats.photoViews,
        uniqueVisitors: dayStats.uniqueVisitors.size,
        guestbookEntries: dayStats.guestbookEntries,
        photoUploads: dayStats.photoUploads,
        engagementScore: this.calculateDailyEngagementScore(dayStats),
      };
    } catch (error) {
      winston.error('Failed to get daily report:', error);
      return { error: error.message };
    }
  }

  // Helper methods
  getPhotoViewCount(photoId) {
    return this.analytics.photoViews.get(photoId)?.length || 0;
  }

  getUniqueViewers(views) {
    return new Set(views.map((v) => v.visitorIp)).size;
  }

  calculatePopularityScore(views) {
    const uniqueViewers = this.getUniqueViewers(views);
    const totalViews = views.length;
    const recency = this.calculateRecencyScore(views);

    // Weighted popularity score
    return uniqueViewers * 2 + totalViews + recency;
  }

  calculateRecencyScore(views) {
    if (views.length === 0) return 0;

    const now = Date.now();
    const lastView = Math.max(...views.map((v) => v.timestamp.getTime()));
    const hoursAgo = (now - lastView) / (1000 * 60 * 60);

    // Higher score for more recent views
    return Math.max(0, 10 - hoursAgo / 24);
  }

  async checkPhotoPopularity(photoId) {
    const viewCount = this.getPhotoViewCount(photoId);
    const threshold = parseInt(process.env.POPULAR_PHOTOS_THRESHOLD) || 10;

    if (viewCount === threshold) {
      // Photo just became popular
      winston.info(`Photo became popular: ${photoId} (${viewCount} views)`);
      // Could trigger notifications or special features here
    }
  }

  async analyzeSentiment(message) {
    // Simple sentiment analysis - could be enhanced with AI
    const positiveWords = [
      'love',
      'beautiful',
      'amazing',
      'wonderful',
      'perfect',
      'happy',
      'joy',
      'magical',
    ];
    const negativeWords = ['sad', 'sorry', 'miss', 'wish'];

    const words = message.toLowerCase().split(/\s+/);
    const positiveCount = words.filter((word) => positiveWords.includes(word)).length;
    const negativeCount = words.filter((word) => negativeWords.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  calculateAverageMessageLength(entries) {
    if (entries.length === 0) return 0;
    return entries.reduce((sum, entry) => sum + entry.messageLength, 0) / entries.length;
  }

  calculateSentimentSummary(entries) {
    const sentiments = entries.map((e) => e.sentiment);
    return {
      positive: sentiments.filter((s) => s === 'positive').length,
      neutral: sentiments.filter((s) => s === 'neutral').length,
      negative: sentiments.filter((s) => s === 'negative').length,
    };
  }

  getMostActiveDay() {
    let mostActiveDay = null;
    let maxActivity = 0;

    for (const [date, stats] of this.analytics.dailyStats) {
      const totalActivity = stats.photoViews + stats.guestbookEntries + stats.photoUploads;
      if (totalActivity > maxActivity) {
        maxActivity = totalActivity;
        mostActiveDay = date;
      }
    }

    return { date: mostActiveDay, activity: maxActivity };
  }

  getEngagementTrend() {
    const last7Days = Array.from(this.analytics.dailyStats.entries())
      .slice(-7)
      .map(([date, stats]) => ({
        date,
        engagement: stats.photoViews + stats.guestbookEntries + stats.photoUploads,
      }));

    return last7Days;
  }

  calculateDailyEngagementScore(dayStats) {
    // Weighted engagement score
    return (
      dayStats.photoViews * 1 +
      dayStats.guestbookEntries * 5 +
      dayStats.photoUploads * 3 +
      dayStats.uniqueVisitors.size * 2
    );
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

export default MemoryAnalyticsService;
