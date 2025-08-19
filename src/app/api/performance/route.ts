import { NextRequest, NextResponse } from 'next/server';

/**
 * Performance API Endpoint
 * Handles performance metrics and monitoring data
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url?: string;
  userAgent?: string;
}

interface ErrorReport {
  message: string;
  stack?: string;
  url?: string;
  timestamp: number;
  userAgent?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Log performance data (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${type}:`, data);
    }

    // Handle different types of performance data
    switch (type) {
      case 'metric': {
        const metric: PerformanceMetric = {
          name: data.name,
          value: data.value,
          timestamp: Date.now(),
          url: request.headers.get('referer') || '',
          userAgent: request.headers.get('user-agent') || '',
        };

        // In production, send to monitoring service like Vercel Analytics, Sentry, etc.
        if (process.env.NODE_ENV === 'development') {
          console.log('[Performance Metric]', metric);
        }
        break;
      }

      case 'error': {
        const error: ErrorReport = {
          message: data.message,
          stack: data.stack,
          url: request.headers.get('referer') || '',
          timestamp: Date.now(),
          userAgent: request.headers.get('user-agent') || '',
        };

        // In production, send to error tracking service
        if (process.env.NODE_ENV === 'development') {
          console.log('[Performance Error]', error);
        }
        break;
      }

      case 'vitals': {
        // Handle Web Vitals data
        if (process.env.NODE_ENV === 'development') {
          console.log('[Web Vitals]', data);
        }
        break;
      }

      default: {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Performance Data]', body);
        }
      }
    }    return NextResponse.json({
      success: true,
      message: 'Performance data received'
    });

  } catch (error) {
    console.error('[Performance API Error]', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process performance data'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Performance monitoring endpoint is active',
    endpoints: {
      POST: 'Send performance metrics',
    }
  });
}
