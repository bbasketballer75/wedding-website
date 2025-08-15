/**
 * Enhanced Web Vitals Monitoring
 * Real-time performance monitoring for production
 */

// Advanced Web Vitals monitoring with detailed logging
function initAdvancedWebVitals() {
  console.log('🚀 Advanced Web Vitals Monitoring Started');
  console.log('==========================================');

  // Performance Observer for detailed metrics
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('🖼️  LCP:', {
          value: Math.round(entry.startTime),
          element: entry.element?.tagName || 'Unknown',
          size: entry.size,
          timestamp: new Date().toISOString(),
        });
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('⚡ FID:', {
          value: Math.round(entry.processingStart - entry.startTime),
          eventType: entry.name,
          timestamp: new Date().toISOString(),
        });
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log('📏 CLS:', {
            value: Math.round(clsValue * 1000) / 1000,
            sources: entry.sources?.length || 0,
            timestamp: new Date().toISOString(),
          });
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Navigation timing
  window.addEventListener('load', () => {
    setTimeout(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      console.log('🌐 Navigation Timing:', {
        domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart),
        loadComplete: Math.round(nav.loadEventEnd - nav.loadEventStart),
        firstByte: Math.round(nav.responseStart - nav.requestStart),
        domInteractive: Math.round(nav.domInteractive - nav.navigationStart),
      });
    }, 1000);
  });

  // Resource timing
  const logLargeResources = () => {
    const resources = performance.getEntriesByType('resource');
    const largeResources = resources
      .filter((r) => r.transferSize > 100000) // > 100KB
      .sort((a, b) => b.transferSize - a.transferSize)
      .slice(0, 10);

    if (largeResources.length > 0) {
      console.log(
        '📦 Large Resources (>100KB):',
        largeResources.map((r) => ({
          name: r.name.split('/').pop(),
          size: Math.round(r.transferSize / 1024) + 'KB',
          duration: Math.round(r.duration) + 'ms',
        }))
      );
    }
  };

  window.addEventListener('load', () => setTimeout(logLargeResources, 2000));
}

// Memory usage monitoring
function monitorMemoryUsage() {
  if ('memory' in performance) {
    setInterval(() => {
      const memory = performance.memory;
      console.log('🧠 Memory Usage:', {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB',
      });
    }, 30000); // Every 30 seconds
  }
}

// Start monitoring
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdvancedWebVitals);
} else {
  initAdvancedWebVitals();
}

monitorMemoryUsage();

console.log('📊 Copy this script to browser console on your production site');
console.log('📈 Monitor Core Web Vitals in real-time');
console.log('🎯 Target values:');
console.log('   - LCP: < 2.5s (Good)');
console.log('   - FID: < 100ms (Good)');
console.log('   - CLS: < 0.1 (Good)');
