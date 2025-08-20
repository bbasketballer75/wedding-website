// Structured data for Austin & Jordyn's wedding website

// Get dynamic base URL
function getBaseURL(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'https://wedding-website-alpha-six.vercel.app')
  );
}

export const weddingStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Austin & Jordyn Wedding',
  description: 'Celebrate with Austin & Jordyn - Wedding photos, guestbook, and memories',
  startDate: '2024-08-17T15:00:00',
  endDate: '2024-08-17T23:00:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Wedding Venue',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Wedding Location',
      addressRegion: 'State',
      addressCountry: 'US',
    },
  },
  organizer: [
    {
      '@type': 'Person',
      name: 'Austin Porada',
    },
    {
      '@type': 'Person',
      name: 'Jordyn Porada',
    },
  ],
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    price: '0',
    priceCurrency: 'USD',
  },
};

export function getWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Austin & Jordyn Wedding Website',
    description: "Wedding photos, guestbook, and memories from Austin & Jordyn's special day",
    url: getBaseURL(),
    author: [
      {
        '@type': 'Person',
        name: 'Austin Porada',
      },
      {
        '@type': 'Person',
        name: 'Jordyn Porada',
      },
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${getBaseURL()}/#guestbook`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export const photoGalleryStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: 'Austin & Jordyn Wedding Photos',
  description: "Photo gallery from Austin & Jordyn's wedding celebration",
  author: [
    {
      '@type': 'Person',
      name: 'Austin Porada',
    },
    {
      '@type': 'Person',
      name: 'Jordyn Porada',
    },
  ],
};
