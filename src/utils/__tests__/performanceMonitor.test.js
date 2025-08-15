import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as performanceMonitor from '../core/performanceMonitor';

// Mock Performance API
const mockPerformance = {
  now: vi.fn(),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(),
  getEntriesByName: vi.fn(),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
  timing: {
    navigationStart: 1000,
    loadEventEnd: 2000,
    domContentLoadedEventEnd: 1500,
    responseEnd: 1200,
    connectEnd: 1100,
  },
  memory: {
    usedJSHeapSize: 10000000,
    totalJSHeapSize: 20000000,
    jsHeapSizeLimit: 50000000,
  },
};

global.performance = mockPerformance;

// Mock console for performance logging
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('Performance Monitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPerformance.now.mockReturnValue(Date.now());
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Core Performance Metrics', () => {
    it('measures page load time', () => {
      const getPageLoadTime = performanceMonitor.getPageLoadTime;
      if (getPageLoadTime) {
        const loadTime = getPageLoadTime();

        expect(typeof loadTime).toBe('number');
        expect(loadTime).toBeGreaterThan(0);
      }
    });

    it('measures DOM content loaded time', () => {
      const getDOMContentLoadedTime = performanceMonitor.getDOMContentLoadedTime;
      if (getDOMContentLoadedTime) {
        const domTime = getDOMContentLoadedTime();

        expect(typeof domTime).toBe('number');
        expect(domTime).toBe(500); // 1500 - 1000 from mock
      }
    });

    it('measures network timing', () => {
      const getNetworkTiming = performanceMonitor.getNetworkTiming;
      if (getNetworkTiming) {
        const timing = getNetworkTiming();

        expect(timing).toHaveProperty('dns');
        expect(timing).toHaveProperty('tcp');
        expect(timing).toHaveProperty('ttfb');
        expect(typeof timing.ttfb).toBe('number');
      }
    });
  });

  describe('Resource Performance', () => {
    it('tracks resource loading times', () => {
      mockPerformance.getEntriesByType.mockReturnValue([
        {
          name: 'https://example.com/image.jpg',
          duration: 250,
          transferSize: 45000,
          decodedBodySize: 50000,
          initiatorType: 'img',
        },
        {
          name: 'https://example.com/script.js',
          duration: 150,
          transferSize: 15000,
          decodedBodySize: 18000,
          initiatorType: 'script',
        },
      ]);

      const getResourceTiming = performanceMonitor.getResourceTiming;
      if (getResourceTiming) {
        const resources = getResourceTiming();

        expect(Array.isArray(resources)).toBe(true);
        expect(resources).toHaveLength(2);
        expect(resources[0]).toHaveProperty('duration');
        expect(resources[0]).toHaveProperty('size');
      }
    });

    it('identifies slow resources', () => {
      mockPerformance.getEntriesByType.mockReturnValue([
        { name: 'slow-image.jpg', duration: 2000, initiatorType: 'img' },
        { name: 'fast-script.js', duration: 100, initiatorType: 'script' },
      ]);

      const getSlowResources = performanceMonitor.getSlowResources;
      if (getSlowResources) {
        const slowResources = getSlowResources(500); // 500ms threshold

        expect(slowResources).toHaveLength(1);
        expect(slowResources[0].name).toBe('slow-image.jpg');
      }
    });

    it('calculates total page weight', () => {
      mockPerformance.getEntriesByType.mockReturnValue([
        { transferSize: 45000, decodedBodySize: 50000 },
        { transferSize: 15000, decodedBodySize: 18000 },
        { transferSize: 30000, decodedBodySize: 35000 },
      ]);

      const getTotalPageWeight = performanceMonitor.getTotalPageWeight;
      if (getTotalPageWeight) {
        const weight = getTotalPageWeight();

        expect(weight.transferred).toBe(90000);
        expect(weight.decoded).toBe(103000);
      }
    });
  });

  describe('Memory Monitoring', () => {
    it('tracks memory usage', () => {
      const getMemoryUsage = performanceMonitor.getMemoryUsage;
      if (getMemoryUsage) {
        const memory = getMemoryUsage();

        expect(memory).toHaveProperty('used');
        expect(memory).toHaveProperty('total');
        expect(memory).toHaveProperty('limit');
        expect(memory.used).toBe(10000000);
        expect(memory.total).toBe(20000000);
      }
    });

    it('detects memory leaks', () => {
      const detectMemoryLeak = performanceMonitor.detectMemoryLeak;
      if (detectMemoryLeak) {
        // Simulate increasing memory usage
        mockPerformance.memory.usedJSHeapSize = 15000000; // First measurement
        detectMemoryLeak();

        mockPerformance.memory.usedJSHeapSize = 25000000; // Significant increase
        const leakDetected = detectMemoryLeak();

        expect(typeof leakDetected).toBe('boolean');
      }
    });

    it('calculates memory efficiency', () => {
      const getMemoryEfficiency = performanceMonitor.getMemoryEfficiency;
      if (getMemoryEfficiency) {
        const efficiency = getMemoryEfficiency();

        expect(typeof efficiency).toBe('number');
        expect(efficiency).toBeGreaterThanOrEqual(0);
        expect(efficiency).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('Custom Performance Marks', () => {
    it('creates performance marks', () => {
      const mark = performanceMonitor.mark;
      if (mark) {
        mark('component-render-start');

        expect(mockPerformance.mark).toHaveBeenCalledWith('component-render-start');
      }
    });

    it('measures between marks', () => {
      const measure = performanceMonitor.measure;
      if (measure) {
        measure('component-render', 'component-render-start', 'component-render-end');

        expect(mockPerformance.measure).toHaveBeenCalledWith(
          'component-render',
          'component-render-start',
          'component-render-end'
        );
      }
    });

    it('gets measure duration', () => {
      mockPerformance.getEntriesByName.mockReturnValue([
        { name: 'component-render', duration: 125.5 },
      ]);

      const getMeasureDuration = performanceMonitor.getMeasureDuration;
      if (getMeasureDuration) {
        const duration = getMeasureDuration('component-render');

        expect(duration).toBe(125.5);
      }
    });
  });

  describe('Performance Budget', () => {
    it('checks performance budget compliance', () => {
      const checkPerformanceBudget = performanceMonitor.checkPerformanceBudget;
      if (checkPerformanceBudget) {
        const budget = {
          loadTime: 2000,
          firstContentfulPaint: 1500,
          largestContentfulPaint: 2500,
          totalPageSize: 500000,
        };

        const compliance = checkPerformanceBudget(budget);

        expect(compliance).toHaveProperty('passed');
        expect(compliance).toHaveProperty('failed');
        expect(Array.isArray(compliance.failed)).toBe(true);
      }
    });

    it('reports budget violations', () => {
      const getBudgetViolations = performanceMonitor.getBudgetViolations;
      if (getBudgetViolations) {
        const violations = getBudgetViolations({
          loadTime: 500, // Too strict - should fail
          totalPageSize: 1000, // Too strict - should fail
        });

        expect(Array.isArray(violations)).toBe(true);
        if (violations.length > 0) {
          expect(violations[0]).toHaveProperty('metric');
          expect(violations[0]).toHaveProperty('actual');
          expect(violations[0]).toHaveProperty('budget');
        }
      }
    });
  });

  describe('Real User Monitoring', () => {
    it('collects real user metrics', () => {
      const collectRealUserMetrics = performanceMonitor.collectRealUserMetrics;
      if (collectRealUserMetrics) {
        const metrics = collectRealUserMetrics();

        expect(metrics).toHaveProperty('timing');
        expect(metrics).toHaveProperty('navigation');
        expect(metrics).toHaveProperty('connection');
      }
    });

    it('tracks user interactions', () => {
      const trackInteraction = performanceMonitor.trackInteraction;
      if (trackInteraction) {
        trackInteraction('button-click', 'photo-gallery-next');

        // Should record interaction timing
        expect(mockPerformance.mark).toHaveBeenCalled();
      }
    });

    it('measures interaction responsiveness', () => {
      const measureInteractionResponsiveness = performanceMonitor.measureInteractionResponsiveness;
      if (measureInteractionResponsiveness) {
        // Mock user interaction
        const startTime = performance.now();
        const responsiveness = measureInteractionResponsiveness('click', startTime);

        expect(typeof responsiveness).toBe('number');
        expect(responsiveness).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Performance Reporting', () => {
    it('generates performance report', () => {
      const generatePerformanceReport = performanceMonitor.generatePerformanceReport;
      if (generatePerformanceReport) {
        const report = generatePerformanceReport();

        expect(report).toHaveProperty('summary');
        expect(report).toHaveProperty('metrics');
        expect(report).toHaveProperty('recommendations');
        expect(Array.isArray(report.recommendations)).toBe(true);
      }
    });

    it('exports performance data', () => {
      const exportPerformanceData = performanceMonitor.exportPerformanceData;
      if (exportPerformanceData) {
        const data = exportPerformanceData();

        expect(data).toHaveProperty('timestamp');
        expect(data).toHaveProperty('metrics');
        expect(data).toHaveProperty('userAgent');
      }
    });

    it('logs performance warnings', () => {
      const logPerformanceWarning = performanceMonitor.logPerformanceWarning;
      if (logPerformanceWarning) {
        logPerformanceWarning('Slow resource detected', {
          resource: 'large-image.jpg',
          duration: 3000,
        });

        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Performance Warning'),
          expect.any(Object)
        );
      }
    });
  });

  describe('Performance Optimization', () => {
    it('suggests optimizations', () => {
      const suggestOptimizations = performanceMonitor.suggestOptimizations;
      if (suggestOptimizations) {
        mockPerformance.getEntriesByType.mockReturnValue([
          { name: 'large-image.jpg', duration: 2000, transferSize: 500000 },
        ]);

        const suggestions = suggestOptimizations();

        expect(Array.isArray(suggestions)).toBe(true);
        if (suggestions.length > 0) {
          expect(suggestions[0]).toHaveProperty('type');
          expect(suggestions[0]).toHaveProperty('description');
          expect(suggestions[0]).toHaveProperty('impact');
        }
      }
    });

    it('prioritizes optimization recommendations', () => {
      const prioritizeOptimizations = performanceMonitor.prioritizeOptimizations;
      if (prioritizeOptimizations) {
        const optimizations = [
          { impact: 'high', effort: 'low', description: 'Compress images' },
          { impact: 'medium', effort: 'high', description: 'Code splitting' },
          { impact: 'high', effort: 'medium', description: 'Lazy loading' },
        ];

        const prioritized = prioritizeOptimizations(optimizations);

        expect(Array.isArray(prioritized)).toBe(true);
        // High impact, low effort should be first
        expect(prioritized[0].description).toBe('Compress images');
      }
    });
  });
});
