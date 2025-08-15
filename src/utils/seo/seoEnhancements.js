// Advanced SEO and social media optimization
export const socialMediaMeta = {
  // Open Graph for Facebook/LinkedIn
  openGraph: {
    title: "Austin & Jordyn's Wedding | The Poradas",
    description:
      'Join us in celebrating our wedding day! Share memories, browse photos, and be part of our love story.',
    url: 'https://www.theporadas.com',
    siteName: 'The Poradas Wedding Website',
    images: [
      {
        url: 'https://www.theporadas.com/images/engagement/PoradaProposal-11.webp',
        width: 1200,
        height: 630,
        alt: 'Austin and Jordyn during their romantic engagement session',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: "Austin & Jordyn's Wedding | The Poradas",
    description:
      'Join us in celebrating our wedding day! Share memories, browse photos, and be part of our love story.',
    creator: '@theporadas',
    images: ['https://www.theporadas.com/images/engagement/PoradaProposal-11.webp'],
  },

  // Rich snippets for events
  eventSchema: {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Austin & Jordyn Porada Wedding',
    description: 'The wedding celebration of Austin and Jordyn Porada',
    image: ['https://www.theporadas.com/images/engagement/PoradaProposal-11.webp'],
    startDate: '2024-08-01T16:00:00-05:00', // Update with actual date
    endDate: '2024-08-01T23:00:00-05:00', // Update with actual date
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Wedding Venue', // Update with actual venue
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'City',
        addressRegion: 'State',
        addressCountry: 'US',
      },
    },
    organizer: {
      '@type': 'Person',
      name: 'Austin & Jordyn Porada',
    },
  },
};

// Performance monitoring for Core Web Vitals
export const webVitalsReporting = () => {
  if (typeof window === 'undefined') return;

  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    function sendToAnalytics(metric) {
      // Send to your analytics service
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        });
      }

      // Also send to Sentry for performance monitoring
      if (window.Sentry) {
        window.Sentry.addBreadcrumb({
          category: 'performance',
          message: `${metric.name}: ${metric.value}`,
          level: 'info',
        });
      }
    }

    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  });
};
