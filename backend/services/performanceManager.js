import NodeCache from 'node-cache';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import compression from 'compression';

/**
 * Performance Manager - Handles caching, rate limiting, and performance optimizations
 */
class PerformanceManager {
  constructor() {
    // Multi-tier cache system
    this.caches = {
      // Fast cache for frequently accessed data (5 min TTL)
      fast: new NodeCache({ stdTTL: 300, checkperiod: 60 }),
      // Medium cache for API responses (15 min TTL)
      medium: new NodeCache({ stdTTL: 900, checkperiod: 180 }),
      // Long cache for static content (1 hour TTL)
      long: new NodeCache({ stdTTL: 3600, checkperiod: 600 }),
      // Session cache for user data (30 min TTL)
      session: new NodeCache({ stdTTL: 1800, checkperiod: 300 }),
    };

    this.rateLimiters = this.createRateLimiters();
    this.performanceMetrics = {
      requests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      rateLimited: 0,
      averageResponseTime: 0,
      lastReset: new Date(),
    };

    this.setupCacheEvents();
    console.log('⚡ Performance Manager initialized with multi-tier caching');
  }

  /**
   * Create rate limiters for different endpoints
   */
  createRateLimiters() {
    return {
      // Strict rate limiting for write operations
      strict: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10, // 10 requests per window
        message: {
          error: 'Too many requests. Please wait before trying again.',
          retryAfter: '15 minutes',
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
          this.performanceMetrics.rateLimited++;
          console.log('🚫 Strict rate limit reached');
          res.status(429).json({
            error: 'Too many requests. Please wait before trying again.',
            retryAfter: '15 minutes',
          });
        },
      }),

      // Moderate rate limiting for API calls
      api: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // 100 requests per window
        message: {
          error: 'API rate limit exceeded. Please slow down.',
          retryAfter: '15 minutes',
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
          this.performanceMetrics.rateLimited++;
          console.log('🚫 API rate limit reached');
          res.status(429).json({
            error: 'API rate limit exceeded. Please slow down.',
            retryAfter: '15 minutes',
          });
        },
      }),

      // Lenient rate limiting for read operations
      read: rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 60, // 60 requests per minute
        message: {
          error: 'Too many read requests. Please wait a moment.',
          retryAfter: '1 minute',
        },
        standardHeaders: true,
        legacyHeaders: false,
      }),

      // AI-specific rate limiting (more restrictive)
      ai: rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 50, // 50 AI requests per hour
        message: {
          error: 'AI service rate limit exceeded. Please try again later.',
          retryAfter: '1 hour',
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
          console.log('🤖 AI rate limit reached');
          res.status(429).json({
            error: 'AI service rate limit exceeded. Please try again later.',
            retryAfter: '1 hour',
          });
        },
      }),

      // WebSocket connection limiting
      websocket: rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 10, // 10 connection attempts per minute
        message: {
          error: 'Too many WebSocket connection attempts.',
          retryAfter: '1 minute',
        },
      }),
    };
  }

  /**
   * Create speed limiters (progressive delay)
   */
  createSpeedLimiters() {
    return {
      // General API slowdown
      api: slowDown({
        windowMs: 15 * 60 * 1000, // 15 minutes
        delayAfter: 50, // Start slowing down after 50 requests
        delayMs: 500, // Add 500ms delay per request after delayAfter
        maxDelayMs: 20000, // Maximum delay of 20 seconds
        onLimitReached: () => {
          console.log('🐌 API speed limit engaged');
        },
      }),

      // Upload slowdown
      upload: slowDown({
        windowMs: 5 * 60 * 1000, // 5 minutes
        delayAfter: 5, // Start slowing down after 5 uploads
        delayMs: 1000, // Add 1s delay per upload
        maxDelayMs: 30000, // Maximum delay of 30 seconds
      }),
    };
  }

  /**
   * Setup cache event listeners for monitoring
   */
  setupCacheEvents() {
    Object.entries(this.caches).forEach(([name, cache]) => {
      cache.on('set', (key) => {
        console.log(`📦 Cache SET [${name}]: ${key}`);
      });

      cache.on('del', (key) => {
        console.log(`🗑️  Cache DEL [${name}]: ${key}`);
      });

      cache.on('expired', (key) => {
        console.log(`⏰ Cache EXPIRED [${name}]: ${key}`);
      });
    });
  }

  /**
   * Smart caching middleware that chooses appropriate cache tier
   */
  createCacheMiddleware(options = {}) {
    const {
      tier = 'medium',
      keyGenerator = this.defaultKeyGenerator,
      ttl,
      condition = () => true,
    } = options;

    return (req, res, next) => {
      // Skip caching for non-GET requests or if condition not met
      if (req.method !== 'GET' || !condition(req)) {
        return next();
      }

      const cacheKey = keyGenerator(req);
      const cache = this.caches[tier];

      // Try to get from cache
      const cachedResponse = cache.get(cacheKey);
      if (cachedResponse) {
        this.performanceMetrics.cacheHits++;
        console.log(`🎯 Cache HIT [${tier}]: ${cacheKey}`);

        // Set cache headers
        res.set({
          'X-Cache': 'HIT',
          'X-Cache-Tier': tier,
          'Cache-Control': 'public, max-age=300',
        });

        return res.json(cachedResponse);
      }

      this.performanceMetrics.cacheMisses++;
      console.log(`❌ Cache MISS [${tier}]: ${cacheKey}`);

      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = function (data) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const cacheTTL = ttl || cache.options.stdTTL;
          cache.set(cacheKey, data, cacheTTL);
          console.log(`💾 Cached [${tier}]: ${cacheKey} (TTL: ${cacheTTL}s)`);
        }

        // Set cache headers
        res.set({
          'X-Cache': 'MISS',
          'X-Cache-Tier': tier,
          'Cache-Control': 'public, max-age=300',
        });

        return originalJson.call(this, data);
      };

      next();
    };
  }

  /**
   * Default cache key generator
   */
  defaultKeyGenerator(req) {
    const url = req.originalUrl || req.url;
    const query = Object.keys(req.query)
      .sort()
      .map((key) => `${key}=${req.query[key]}`)
      .join('&');

    return `${req.method}:${url}${query ? `?${query}` : ''}`;
  }

  /**
   * Cache invalidation by pattern
   */
  invalidateCache(pattern, tier = null) {
    const tiersToInvalidate = tier ? [tier] : Object.keys(this.caches);
    let totalInvalidated = 0;

    tiersToInvalidate.forEach((tierName) => {
      const cache = this.caches[tierName];
      const keys = cache.keys();

      keys.forEach((key) => {
        if (key.includes(pattern)) {
          cache.del(key);
          totalInvalidated++;
          console.log(`🗑️  Invalidated cache [${tierName}]: ${key}`);
        }
      });
    });

    console.log(
      `🧹 Cache invalidation complete: ${totalInvalidated} keys removed for pattern "${pattern}"`
    );
    return totalInvalidated;
  }

  /**
   * Smart cache warming for frequently accessed data
   */
  async warmCache() {
    console.log('🔥 Starting cache warming...');

    try {
      // Warm up activity feed cache
      await this.warmActivityFeed();

      // Warm up guestbook cache
      await this.warmGuestbook();

      // Warm up photo metadata cache
      await this.warmPhotoMetadata();

      console.log('✅ Cache warming completed');
    } catch (error) {
      console.error('❌ Cache warming failed:', error);
    }
  }

  /**
   * Warm activity feed cache
   */
  async warmActivityFeed() {
    // This would typically fetch from database and cache the results
    const mockActivities = [
      { id: '1', type: 'guestbook', description: 'New guestbook entry' },
      { id: '2', type: 'photo', description: 'Photo uploaded' },
    ];

    this.caches.fast.set('api:activities:recent', mockActivities);
    console.log('🔥 Warmed activity feed cache');
  }

  /**
   * Warm guestbook cache
   */
  async warmGuestbook() {
    const mockGuestbook = [
      { id: '1', name: 'John', message: 'Congratulations!' },
      { id: '2', name: 'Jane', message: 'Beautiful wedding!' },
    ];

    this.caches.medium.set('api:guestbook:entries', mockGuestbook);
    console.log('🔥 Warmed guestbook cache');
  }

  /**
   * Warm photo metadata cache
   */
  async warmPhotoMetadata() {
    const mockPhotos = [
      { id: '1', url: '/photos/ceremony.jpg', caption: 'Ceremony' },
      { id: '2', url: '/photos/reception.jpg', caption: 'Reception' },
    ];

    this.caches.long.set('api:photos:metadata', mockPhotos);
    console.log('🔥 Warmed photo metadata cache');
  }

  /**
   * Performance monitoring middleware
   */
  createPerformanceMiddleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      this.performanceMetrics.requests++;

      // Override res.end to capture response time
      const originalEnd = res.end;
      res.end = (...args) => {
        const responseTime = Date.now() - startTime;

        // Update average response time
        this.performanceMetrics.averageResponseTime =
          (this.performanceMetrics.averageResponseTime * (this.performanceMetrics.requests - 1) +
            responseTime) /
          this.performanceMetrics.requests;

        // Add performance headers
        res.set({
          'X-Response-Time': `${responseTime}ms`,
          'X-Request-ID': req.headers['x-request-id'] || `req_${Date.now()}`,
        });

        // Log slow requests
        if (responseTime > 1000) {
          console.warn(`🐌 Slow request: ${req.method} ${req.originalUrl} (${responseTime}ms)`);
        }

        return originalEnd.apply(res, args);
      };

      next();
    };
  }

  /**
   * Compression middleware with smart configuration
   */
  createCompressionMiddleware() {
    return compression({
      // Compress responses above 1KB
      threshold: 1024,

      // Custom filter for what to compress
      filter: (req, res) => {
        // Don't compress if client doesn't support it
        if (req.headers['x-no-compression']) {
          return false;
        }

        // Don't compress images or videos
        const contentType = res.getHeader('content-type');
        if (
          contentType &&
          (contentType.includes('image/') ||
            contentType.includes('video/') ||
            contentType.includes('audio/'))
        ) {
          return false;
        }

        // Use compression for text-based content
        return compression.filter(req, res);
      },

      // Compression level (1-9, 6 is good balance)
      level: 6,

      // Memory level (1-9, 8 is good balance)
      memLevel: 8,
    });
  }

  /**
   * Cache statistics and health check
   */
  getCacheStats() {
    const stats = {};

    Object.entries(this.caches).forEach(([name, cache]) => {
      const keys = cache.keys();
      stats[name] = {
        keys: keys.length,
        hits: cache.getStats().hits || 0,
        misses: cache.getStats().misses || 0,
        ksize: cache.getStats().ksize || 0,
        vsize: cache.getStats().vsize || 0,
      };
    });

    return {
      ...stats,
      performance: this.performanceMetrics,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Clear all caches
   */
  clearAllCaches() {
    let totalCleared = 0;

    Object.entries(this.caches).forEach(([name, cache]) => {
      const keyCount = cache.keys().length;
      cache.flushAll();
      totalCleared += keyCount;
      console.log(`🧹 Cleared ${keyCount} keys from ${name} cache`);
    });

    console.log(`🧹 Total cache clear: ${totalCleared} keys removed`);
    return totalCleared;
  }

  /**
   * Memory usage optimization
   */
  optimizeMemory() {
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      console.log('🧹 Forced garbage collection');
    }

    // Clear least recently used items from caches if memory usage is high
    const memUsage = process.memoryUsage();
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;

    if (heapUsedMB > 100) {
      // If using more than 100MB
      console.log(`💾 High memory usage detected: ${heapUsedMB.toFixed(2)}MB`);

      // Clear half of the fast cache (most volatile)
      const fastKeys = this.caches.fast.keys();
      const keysToRemove = fastKeys.slice(0, Math.floor(fastKeys.length / 2));
      keysToRemove.forEach((key) => this.caches.fast.del(key));

      console.log(
        `🧹 Cleared ${keysToRemove.length} items from fast cache for memory optimization`
      );
    }
  }

  /**
   * Graceful shutdown
   */
  shutdown() {
    console.log('🛑 Performance Manager shutting down...');

    // Clear all caches
    this.clearAllCaches();

    // Close cache instances
    Object.values(this.caches).forEach((cache) => {
      cache.close();
    });

    console.log('🛑 Performance Manager shutdown complete');
  }
}

// Create singleton instance
const performanceManager = new PerformanceManager();

// Export both the manager and individual middleware
export default performanceManager;
export const {
  rateLimiters,
  createCacheMiddleware,
  createPerformanceMiddleware,
  createCompressionMiddleware,
} = performanceManager;
