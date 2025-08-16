import { NextRequest, NextResponse } from 'next/server';

/**
 * 📊 Enhanced Performance Analytics API
 * Collects and stores Core Web Vitals and performance metrics
 */

interface WebVitalMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}

interface PerformanceData {
  url: string;
  userAgent: string;
  connection?: string;
  metrics: WebVitalMetric[];
  timestamp: number;
  sessionId: string;
}

// In-memory storage (in production, use a proper database)
const performanceStore = new Map<string, PerformanceData[]>();
const STORE_LIMIT = 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Request body:", body);
    const { type } = body;

    // Handle Web Vitals data
    if (body.sessionId && body.metrics) {
      return handleWebVitalsData(body);
    }

    // Handle legacy performance data types
    switch (type) {
      case 'metrics':
        return NextResponse.json({
          success: true,
          message: 'Performance metrics recorded successfully',
        });

      case 'alerts':
        return NextResponse.json({
          success: true,
          message: 'Performance alert recorded successfully',
        });

      default:
        return NextResponse.json({
          success: true,
          message: 'Performance data recorded successfully',
        });
    }
  } catch (error) {
    console.error('Performance API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record performance data' },
      { status: 500 }
    );
  }
}

async function handleWebVitalsData(data: PerformanceData) {
  try {
    // Validate required fields
    if (!data.sessionId || !data.metrics || !Array.isArray(data.metrics)) {
      return NextResponse.json({ error: 'Invalid Web Vitals data format' }, { status: 400 });
    }

    // Get or create session data
    const sessionKey = `${data.sessionId}_${new Date().toISOString().split('T')[0]}`;
    let sessionData = performanceStore.get(sessionKey) || [];

    // Add new data
    sessionData.push({
      ...data,
      timestamp: Date.now(),
    });

    // Limit storage size
    if (sessionData.length > STORE_LIMIT) {
      sessionData = sessionData.slice(-STORE_LIMIT);
    }

    performanceStore.set(sessionKey, sessionData);

    // Log poor performance for monitoring
    data.metrics.forEach((metric) => {
      if (metric.rating === 'poor') {
        console.warn(`🚨 Poor ${metric.name}: ${metric.value}ms at ${data.url}`);
      }
    });

    return NextResponse.json({
      success: true,
      stored: data.metrics.length,
    });
  } catch (error) {
    console.error('Web Vitals storage error:', error);
    return NextResponse.json({ error: 'Failed to store Web Vitals data' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '24h';

    // Calculate analytics from stored data
    const allMetrics: WebVitalMetric[] = [];
    performanceStore.forEach((sessionData) => {
      sessionData.forEach((data) => {
        allMetrics.push(...data.metrics);
      });
    });

    const summary = {
      totalSessions: performanceStore.size,
      totalMetrics: allMetrics.length,
      poorPerformance: allMetrics.filter((m) => m.rating === 'poor').length,
      averageLCP: calculateAverage(allMetrics.filter((m) => m.name === 'LCP')),
      averageFCP: calculateAverage(allMetrics.filter((m) => m.name === 'FCP')),
    };

    return NextResponse.json({
      success: true,
      timeframe,
      summary,
    });
  } catch (error) {
    console.error('Performance analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve performance analytics' },
      { status: 500 }
    );
  }
}

function calculateAverage(metrics: WebVitalMetric[]): number {
  if (metrics.length === 0) return 0;
  const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
  return Math.round(sum / metrics.length);
}
