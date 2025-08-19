'use client';

/**
 * 🎯 Advanced SEO & Performance Manager
 *
 * Comprehensive SEO optimization and performance monitoring:
 * - Dynamic meta tags
 * - Structured data
 * - Core Web Vitals
 * - Social media optimization
 * - Search engine optimization
 */

import { useAnalytics } from '@/providers/AnalyticsProvider';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: Record<string, unknown>;
}

// Type definitions
type PerformanceRating = 'good' | 'needs-improvement' | 'poor';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: PerformanceRating;
}

interface AnalyticsProvider {
  trackEvent?: (_event: unknown) => void;
  trackPerformance?: (_metric: string, value: number) => void;
}

type GtagFunction = (
  _command: string,
  action: string,
  parameters?: Record<string, unknown>
) => void;

// Removed unused PerformanceEntryWithTiming interface

declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}

export class SEOManager {
  private static instance: SEOManager;
  private currentConfig: SEOConfig | null = null;

  static getInstance(): SEOManager {
    if (!SEOManager.instance) {
      SEOManager.instance = new SEOManager();
    }
    return SEOManager.instance;
  }

  // SEO configurations for different pages
  private pageConfigs: Record<string, SEOConfig> = {
    '/': {
      title: "Austin & Partner's Wedding - August 2025",
      description:
        'Join us for our magical wedding celebration in August 2025. Share our love story, view photos, and be part of our special day.',
      keywords: ['wedding', 'Austin', 'August 2025', 'love story', 'celebration', 'marriage'],
      ogType: 'website',
      ogImage: '/images/og-wedding-home.jpg',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: "Austin & Partner's Wedding",
        startDate: '2025-08-15',
        location: {
          '@type': 'Place',
          name: 'Wedding Venue',
          address: 'Wedding Location',
        },
        description: 'A magical wedding celebration',
        organizer: {
          '@type': 'Person',
          name: 'Austin',
        },
      },
    },
    '/gallery': {
      title: 'Wedding Photo Gallery - Our Precious Memories',
      description:
        'Browse our beautiful wedding photo collection. Relive the magical moments of our special day through stunning photography.',
      keywords: ['wedding photos', 'gallery', 'memories', 'photography', 'wedding pictures'],
      ogType: 'article',
      ogImage: '/images/og-gallery.jpg',
    },
    '/story': {
      title: 'Our Love Story - How We Met and Fell in Love',
      description:
        'Discover our beautiful love story - from our first meeting to our engagement. Read about our journey together.',
      keywords: ['love story', 'how we met', 'relationship', 'engagement', 'romance'],
      ogType: 'article',
      ogImage: '/images/og-story.jpg',
    },
    '/guestbook': {
      title: 'Wedding Guestbook - Share Your Wishes',
      description:
        'Leave your wedding wishes and memories in our digital guestbook. Share your thoughts and blessings for our new journey.',
      keywords: ['guestbook', 'wedding wishes', 'memories', 'blessings', 'messages'],
      ogType: 'article',
      ogImage: '/images/og-guestbook.jpg',
    },
    '/music': {
      title: 'Wedding Music & Playlist - Our Special Songs',
      description:
        'Listen to our wedding playlist featuring all the songs that are special to us. Enjoy the music that celebrates our love.',
      keywords: ['wedding music', 'playlist', 'love songs', 'wedding songs', 'romantic music'],
      ogType: 'music.playlist',
      ogImage: '/images/og-music.jpg',
    },
  };

  getConfigForPath(pathname: string): SEOConfig {
    return this.pageConfigs[pathname] || this.pageConfigs['/'];
  }

  updateConfig(pathname: string, config: Partial<SEOConfig>) {
    this.pageConfigs[pathname] = {
      ...this.pageConfigs[pathname],
      ...config,
    };
    this.currentConfig = this.pageConfigs[pathname];
  }

  generateMetaTags(config: SEOConfig, pathname: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://austin-wedding.vercel.app';
    const canonicalUrl = config.canonicalUrl || `${baseUrl}${pathname}`;

    return {
      title: config.title,
      description: config.description,
      keywords: config.keywords?.join(', '),
      canonical: canonicalUrl,
      openGraph: {
        title: config.title,
        description: config.description,
        type: config.ogType || 'website',
        url: canonicalUrl,
        images: config.ogImage
          ? [
              {
                url: `${baseUrl}${config.ogImage}`,
                width: 1200,
                height: 630,
                alt: config.title,
              },
            ]
          : [],
        siteName: "Austin & Partner's Wedding",
      },
      twitter: {
        card: 'summary_large_image',
        title: config.title,
        description: config.description,
        images: config.ogImage ? [`${baseUrl}${config.ogImage}`] : [],
      },
      robots: config.noIndex ? 'noindex,nofollow' : 'index,follow',
    };
  }
}

export class PerformanceMonitor {
  private readonly analytics: AnalyticsProvider;

  constructor(analytics: unknown) {
    this.analytics = analytics as AnalyticsProvider;
  }

  // Monitor Core Web Vitals
  observeWebVitals() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    this.observeLCP();

    // First Input Delay (FID)
    this.observeFID();

    // Cumulative Layout Shift (CLS)
    this.observeCLS();

    // Time to First Byte (TTFB)
    this.observeTTFB();
  }

  private observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        const metric: PerformanceMetric = {
          name: 'LCP',
          value: Math.round(lastEntry.startTime),
          rating: this.getLCPRating(lastEntry.startTime),
        };

        this.reportMetric(metric);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  private observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry: unknown) => {
          const perfEntry = entry as { processingStart: number; startTime: number };
          const metric: PerformanceMetric = {
            name: 'FID',
            value: Math.round(perfEntry.processingStart - perfEntry.startTime),
            rating: this.getFIDRating(perfEntry.processingStart - perfEntry.startTime),
          };

          this.reportMetric(metric);
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  private observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry: unknown) => {
          const perfEntry = entry as { hadRecentInput: boolean; value: number };
          if (!perfEntry.hadRecentInput) {
            clsValue += perfEntry.value;
          }
        });

        const metric: PerformanceMetric = {
          name: 'CLS',
          value: Math.round(clsValue * 1000) / 1000,
          rating: this.getCLSRating(clsValue),
        };

        this.reportMetric(metric);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private observeTTFB() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry: unknown) => {
          const perfEntry = entry as { responseStart: number; requestStart: number };
          const metric: PerformanceMetric = {
            name: 'TTFB',
            value: Math.round(perfEntry.responseStart - perfEntry.requestStart),
            rating: this.getTTFBRating(perfEntry.responseStart - perfEntry.requestStart),
          };

          this.reportMetric(metric);
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  private getLCPRating(value: number): PerformanceRating {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private getFIDRating(value: number): PerformanceRating {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private getCLSRating(value: number): PerformanceRating {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  private getTTFBRating(value: number): PerformanceRating {
    if (value <= 800) return 'good';
    if (value <= 1800) return 'needs-improvement';
    return 'poor';
  }

  private reportMetric(metric: PerformanceMetric) {
    // Log performance metric for development only
    if (process.env.NODE_ENV === 'development') {
      console.warn(`📊 ${metric.name}: ${metric.value}ms (${metric.rating})`);
    }

    // Report to analytics
    if (this.analytics?.trackPerformance) {
      this.analytics.trackPerformance(metric.name, metric.value);
    }

    // Report to Web Vitals API if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'web_vitals', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        custom_map: {
          metric_name: 'custom_metric_name',
          metric_value: 'custom_metric_value',
        },
      });
    }
  }
}

/**
 * SEO and Performance Component
 */
export const SEOAndPerformance: React.FC = () => {
  const pathname = usePathname();
  const analytics = useAnalytics();

  useEffect(() => {
    // Initialize performance monitoring
    const monitor = new PerformanceMonitor(analytics);
    monitor.observeWebVitals();

    // Track page view for analytics
    analytics.trackPageView(pathname);

    // Monitor resource loading
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: unknown) => {
        const perfEntry = entry as { duration: number; name: string };
        if (perfEntry.duration > 1000) {
          // Log slow resources
          console.warn(`🐌 Slow resource: ${perfEntry.name} (${Math.round(perfEntry.duration)}ms)`);
          analytics.trackPerformance('slow_resource', perfEntry.duration);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => {
      observer.disconnect();
    };
  }, [pathname, analytics]);

  // Get SEO config for current page
  const seoManager = SEOManager.getInstance();
  const seoConfig = seoManager.getConfigForPath(pathname);
  const metaTags = seoManager.generateMetaTags(seoConfig, pathname);

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.description} />
      {metaTags.keywords && <meta name="keywords" content={metaTags.keywords} />}
      <meta name="robots" content={metaTags.robots} />
      <link rel="canonical" href={metaTags.canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={metaTags.openGraph.title} />
      <meta property="og:description" content={metaTags.openGraph.description} />
      <meta property="og:type" content={metaTags.openGraph.type} />
      <meta property="og:url" content={metaTags.openGraph.url} />
      <meta property="og:site_name" content={metaTags.openGraph.siteName} />
      {metaTags.openGraph.images.map((image, index) => (
        <React.Fragment key={`og-image-${image.url}-${index}`}>
          <meta property="og:image" content={image.url} />
          <meta property="og:image:width" content={image.width.toString()} />
          <meta property="og:image:height" content={image.height.toString()} />
          <meta property="og:image:alt" content={image.alt} />
        </React.Fragment>
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content={metaTags.twitter.card} />
      <meta name="twitter:title" content={metaTags.twitter.title} />
      <meta name="twitter:description" content={metaTags.twitter.description} />
      {metaTags.twitter.images.map((image, index) => (
        <meta key={`twitter-image-${image}-${index}`} name="twitter:image" content={image} />
      ))}

      {/* PWA Meta Tags */}
      <meta name="theme-color" content="#9caf88" />
      <meta name="application-name" content="Austin's Wedding" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Austin's Wedding" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-tap-highlight" content="no" />

      {/* Structured Data */}
      {seoConfig.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seoConfig.structuredData),
          }}
        />
      )}

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://vercel.live" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
    </Head>
  );
};
