import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Allura, Cormorant_Garamond, Inter } from 'next/font/google';
import Script from 'next/script';
import React from 'react';
// Enhanced Phase 2D: Modern AI & PWA Provider Architecture
import { SEOAndPerformance } from '../components/seo/SEOManager';
import { AppProviders } from '../providers/AppProviders';
// Legacy components for compatibility
import AccessibilityMonitor from '../components/accessibility/AccessibilityMonitor';
import StructuredData from '../components/seo/StructuredData';
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration';
// Modern design styles are included in globals.css
import Navbar from '../components/Navbar';
import './globals.css';

// Configure premium wedding fonts
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const allura = Allura({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Austin & Partner's Wedding - August 2025",
    template: "%s | Austin & Partner's Wedding",
  },
  description:
    'Join us for our magical wedding celebration in August 2025. Share our love story, view photos, and be part of our special day.',
  keywords: [
    'wedding',
    'Austin',
    'August 2025',
    'wedding photos',
    'guestbook',
    'celebration',
    'love story',
    'marriage',
  ],
  authors: [{ name: 'Austin' }],
  creator: 'Austin & Partner',
  publisher: 'Wedding Website',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://austin-wedding.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://austin-wedding.vercel.app',
    title: "Austin & Partner's Wedding - August 2025",
    description:
      'Join us for our magical wedding celebration in August 2025. Share our love story, view photos, and be part of our special day.',
    siteName: "Austin & Partner's Wedding",
    images: [
      {
        url: '/images/landing-bg.jpg',
        width: 1200,
        height: 630,
        alt: "Austin & Partner's Wedding",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Austin & Partner's Wedding - August 2025",
    description:
      'Join us for our magical wedding celebration in August 2025. Share our love story and memories.',
    images: ['/images/landing-bg.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#9caf88' },
    { media: '(prefers-color-scheme: dark)', color: '#7a8b6c' },
  ],
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>{/* Enhanced Structured Data for SEO - temporarily disabled */}</head>
      <body
        className={`antialiased ${cormorantGaramond.variable} ${inter.variable} ${allura.variable}`}
      >
        {/* Skip Navigation Links for Accessibility */}
        <a
          href="#main-content"
          className="skip-link"
          style={{
            position: 'absolute',
            left: '-9999px',
            zIndex: 999,
            padding: '8px 16px',
            background: 'var(--sage-green)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Skip to main content
        </a>
        <a
          href="#navigation"
          className="skip-link"
          style={{
            position: 'absolute',
            left: '-9999px',
            zIndex: 999,
            padding: '8px 16px',
            background: 'var(--sage-green)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Skip to navigation
        </a>
        <ServiceWorkerRegistration />

        {/* Primary site navigation for accessibility */}
        <Navbar onePage={true} />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true
            });
          `}
        </Script>

        {/* Wedding-specific Analytics */}
        <Script src="/analytics.js" strategy="afterInteractive" />
        <Script src="/utils/performanceMonitor.js" strategy="afterInteractive" />

        {/* Vercel Analytics & Speed Insights */}
        <Analytics />
        <SpeedInsights />

        {/* Enhanced Phase 2D: Modern AI & PWA Architecture */}
        <AppProviders>
          <SEOAndPerformance />
          <AccessibilityMonitor />
          <StructuredData />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
