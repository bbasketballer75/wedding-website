/**
 * Enhanced structured data for wedding website SEO
 */

export const weddingStructuredData = {
  // Wedding Event Schema
  wedding: {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Austin & Jordyn Porada Wedding',
    description:
      'Celebrate the wedding of Austin & Jordyn Porada with photos, memories, and guestbook messages',
    startDate: '2024-09-15T16:00:00-05:00', // Update with actual date
    endDate: '2024-09-15T23:00:00-05:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Wedding Venue', // Update with actual venue
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Wedding Street',
        addressLocality: 'City',
        addressRegion: 'State',
        postalCode: '12345',
        addressCountry: 'US',
      },
    },
    organizer: [
      {
        '@type': 'Person',
        name: 'Austin Porada',
        url: 'https://www.theporadas.com',
      },
      {
        '@type': 'Person',
        name: 'Jordyn Porada',
        url: 'https://www.theporadas.com',
      },
    ],
    image: [
      'https://www.theporadas.com/images/landing-bg.webp',
      'https://www.theporadas.com/images/couple-photo.webp',
    ],
    url: 'https://www.theporadas.com',
  },

  // Website Schema
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Austin & Jordyn Porada Wedding Website',
    url: 'https://www.theporadas.com',
    description: 'Wedding website featuring photo gallery, guestbook, and celebration memories',
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
      target: 'https://www.theporadas.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },

  // Photo Gallery Schema
  photoGallery: {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Austin & Jordyn Wedding Photo Gallery',
    description: "Beautiful wedding photos from Austin & Jordyn's special day",
    url: 'https://www.theporadas.com/#album',
    author: {
      '@type': 'Person',
      name: 'Austin & Jordyn Porada',
    },
  },

  // Person Schemas
  austin: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Austin Porada',
    spouse: 'Jordyn Porada',
    url: 'https://www.theporadas.com',
    sameAs: [
      'https://instagram.com/austin.porada', // Update with real social links
      'https://facebook.com/austin.porada',
    ],
  },

  jordyn: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jordyn Porada',
    spouse: 'Austin Porada',
    url: 'https://www.theporadas.com',
    sameAs: [
      'https://instagram.com/jordyn.porada', // Update with real social links
      'https://facebook.com/jordyn.porada',
    ],
  },

  // Breadcrumb Schema
  breadcrumb: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.theporadas.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Photo Album',
        item: 'https://www.theporadas.com/#album',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Guestbook',
        item: 'https://www.theporadas.com/#guestbook',
      },
    ],
  },

  // Organization Schema
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Poradas',
    url: 'https://www.theporadas.com',
    logo: 'https://www.theporadas.com/images/logo.png',
    sameAs: ['https://instagram.com/theporadas', 'https://facebook.com/theporadas'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'General Inquiry',
      email: 'hello@theporadas.com',
    },
  },
};

// Helper function to generate JSON-LD script tag
export function generateStructuredDataScript(data) {
  return {
    __html: JSON.stringify(data, null, 2),
  };
}

// Get all structured data for homepage
export function getHomepageStructuredData() {
  return [
    weddingStructuredData.wedding,
    weddingStructuredData.website,
    weddingStructuredData.photoGallery,
    weddingStructuredData.breadcrumb,
    weddingStructuredData.organization,
  ];
}
