// Structured data for Austin & Jordyn's wedding website
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

export const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Austin & Jordyn Wedding Website',
  description: "Wedding photos, guestbook, and memories from Austin & Jordyn's special day",
  url: 'https://theporadas.com',
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
    target: 'https://theporadas.com/#guestbook',
    'query-input': 'required name=search_term_string',
  },
};

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
