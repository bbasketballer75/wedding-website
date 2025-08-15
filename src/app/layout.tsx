import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Allura, Cormorant_Garamond, Inter } from 'next/font/google';
import Script from 'next/script';
import { AudioProvider } from '../components/AmbientSoundSystem';
import { EnhancedErrorBoundary } from '../components/EnhancedErrorBoundary';
import { ToastProvider } from '../components/MagicalToastSystem';
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration';
import '../styles/core/modern-2025-design.css';
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
    default: 'Austin & Jordyn - Wedding Website',
    template: '%s | Austin & Jordyn',
  },
  description:
    'Celebrate with Austin & Jordyn - Wedding photos, guestbook, and memories from our special day',
  keywords: [
    'wedding',
    'Austin Porada',
    'Jordyn Porada',
    'wedding photos',
    'guestbook',
    'celebration',
  ],
  authors: [{ name: 'Austin Porada' }, { name: 'Jordyn Porada' }],
  creator: 'Austin & Jordyn Porada',
  publisher: 'The Poradas',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://theporadas.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://theporadas.com',
    title: 'Austin & Jordyn - Wedding Website',
    description:
      'Celebrate with Austin & Jordyn - Wedding photos, guestbook, and memories from our special day',
    siteName: 'Austin & Jordyn Wedding',
    images: [
      {
        url: '/images/landing-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Austin & Jordyn Wedding',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Austin & Jordyn - Wedding Website',
    description: 'Celebrate with Austin & Jordyn - Wedding photos, guestbook, and memories',
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
        <Script src="/analytics.js" strategy="afterInteractive" />
        <Script src="/utils/performanceMonitor.js" strategy="afterInteractive" />
        <SpeedInsights />
        <AudioProvider>
          <ToastProvider>
            <EnhancedErrorBoundary componentName="RootLayout" sessionStart={Date.now()}>
              {children}
            </EnhancedErrorBoundary>
          </ToastProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
