// Performance monitoring utilities used by tests

function getTiming() {
  return (typeof performance !== 'undefined' && (performance.timing || {})) || {};
}

export function getPageLoadTime() {
  const t = getTiming();
  const v = (t.loadEventEnd || 0) - (t.navigationStart || 0);
  return Number.isFinite(v) ? v : 0;
}

export function getDOMContentLoadedTime() {
  const t = getTiming();
  const v = (t.domContentLoadedEventEnd || 0) - (t.navigationStart || 0);
  return Number.isFinite(v) ? v : 0;
}

export function getNetworkTiming() {
  const t = getTiming();
  return {
    dns: (t.domainLookupEnd || 0) - (t.domainLookupStart || 0),
    tcp: (t.connectEnd || 0) - (t.connectStart || 0),
    ttfb: (t.responseStart || 0) - (t.requestStart || 0),
  };
}

export function getResourceTiming() {
  if (typeof performance?.getEntriesByType !== 'function') return [];
  const entries = performance.getEntriesByType('resource') || [];
  return entries.map((e) => ({
    name: e.name,
    duration: e.duration,
    size: e.transferSize ?? e.decodedBodySize ?? 0,
    initiatorType: e.initiatorType,
  }));
}

export function getSlowResources(thresholdMs = 1000) {
  return getResourceTiming().filter((r) => r.duration >= thresholdMs);
}

export function getTotalPageWeight() {
  if (typeof performance?.getEntriesByType !== 'function') return { transferred: 0, decoded: 0 };
  const entries = performance.getEntriesByType('resource') || [];
  const transferred = entries.reduce((s, e) => s + (e.transferSize || 0), 0);
  const decoded = entries.reduce((s, e) => s + (e.decodedBodySize || 0), 0);
  return { transferred, decoded };
}

export function getMemoryUsage() {
  const m = performance?.memory || {};
  return {
    used: m.usedJSHeapSize || 0,
    total: m.totalJSHeapSize || 0,
    limit: m.jsHeapSizeLimit || 0,
  };
}

let lastHeap = 0;
export function detectMemoryLeak() {
  const used = performance?.memory?.usedJSHeapSize || 0;
  const leak = used > lastHeap * 1.5 && lastHeap > 0;
  lastHeap = used;
  return leak;
}

export function getMemoryEfficiency() {
  const m = getMemoryUsage();
  if (!m.limit || !m.total) return 1;
  return Math.max(0, Math.min(1, 1 - m.used / m.limit));
}

export function mark(name) {
  if (typeof performance?.mark === 'function') performance.mark(name);
}

export function measure(name, start, end) {
  if (typeof performance?.measure === 'function') performance.measure(name, start, end);
}

export function getMeasureDuration(name) {
  const entries = performance?.getEntriesByName?.(name) || [];
  return entries[0]?.duration ?? 0;
}

export function checkPerformanceBudget(budget = {}) {
  const loadTime = getPageLoadTime();
  const size = getTotalPageWeight();
  const failed = [];
  if (budget.loadTime && loadTime > budget.loadTime)
    failed.push({ metric: 'loadTime', actual: loadTime, budget: budget.loadTime });
  if (budget.totalPageSize && size.transferred > budget.totalPageSize)
    failed.push({
      metric: 'totalPageSize',
      actual: size.transferred,
      budget: budget.totalPageSize,
    });
  return { passed: failed.length === 0, failed };
}

export function getBudgetViolations(budget = {}) {
  return checkPerformanceBudget(budget).failed;
}

export function collectRealUserMetrics() {
  return {
    timing: getTiming(),
    navigation:
      typeof performance?.getEntriesByType === 'function'
        ? performance.getEntriesByType('navigation')
        : [],
    connection: navigator?.connection || {},
  };
}

export function trackInteraction(type, name) {
  mark(`interaction:${type}:${name}:start`);
}

export function measureInteractionResponsiveness(type, startTime) {
  const end = performance?.now?.() || Date.now();
  return Math.max(0, end - startTime);
}

export function generatePerformanceReport() {
  return {
    summary: {
      loadTime: getPageLoadTime(),
      domContentLoaded: getDOMContentLoadedTime(),
    },
    metrics: {
      resources: getResourceTiming().length,
      memory: getMemoryUsage(),
    },
    recommendations: [],
  };
}

export function exportPerformanceData() {
  return {
    timestamp: Date.now(),
    metrics: generatePerformanceReport().metrics,
    userAgent: navigator?.userAgent || '',
  };
}

export function logPerformanceWarning(message, data) {
  // eslint-disable-next-line no-console
  // Only log warnings in development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log(`Performance Warning: ${message}`, data || {});
  }
}

export function suggestOptimizations() {
  const entries =
    typeof performance?.getEntriesByType === 'function'
      ? performance.getEntriesByType('resource')
      : [];
  const suggestions = [];
  for (const e of entries) {
    if ((e.transferSize || 0) > 300000) {
      suggestions.push({
        type: 'image',
        description: `Compress large resource ${e.name}`,
        impact: 'high',
      });
    }
  }
  return suggestions;
}

export function prioritizeOptimizations(items = []) {
  const weight = (impact) => {
    if (impact === 'high') return 2;
    if (impact === 'medium') return 1;
    return 0;
  };
  const effortScore = (effort) => {
    if (effort === 'low') return 0;
    if (effort === 'medium') return 1;
    return 2;
  };
  return [...items].sort((a, b) => {
    const aScore = weight(a.impact) - effortScore(a.effort);
    const bScore = weight(b.impact) - effortScore(b.effort);
    return bScore - aScore;
  });
}
