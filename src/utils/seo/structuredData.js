/**
 * Enhanced structured data for wedding website SEO
 */

// Dynamic base URL function that works in both client and server environments
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://wedding-website-main-otacvg389-bbasketballer75s-projects.vercel.app'
  );
};

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
        url: getBaseURL(),
      },
      {
        '@type': 'Person',
        name: 'Jordyn Porada',
        url: getBaseURL(),
      },
    ],
    image: [`${getBaseURL()}/images/landing-bg.webp`, `${getBaseURL()}/images/couple-photo.webp`],
    url: getBaseURL(),
  },

  // Website Schema
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Austin & Jordyn Porada Wedding Website',
    url: getBaseURL(),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getBaseURL()}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },

  // Photo Album Schema
  photoAlbum: {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Wedding Photo Album',
    description: "Beautiful photos from Austin & Jordyn's wedding celebration",
    url: `${getBaseURL()}/#album`,
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
        item: getBaseURL(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Photo Album',
        item: `${getBaseURL()}/#album`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Guestbook',
        item: `${getBaseURL()}/#guestbook`,
      },
    ],
  },

  // Organization Schema
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Austin & Jordyn Porada Wedding',
    url: getBaseURL(),
    logo: `${getBaseURL()}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@weddingsite.com',
      contactType: 'Wedding Information',
    },
  },
};

// Helper function to generate structured data for specific pages
export const generateStructuredData = (type, customData = {}) => {
  const baseData = weddingStructuredData[type];
  if (!baseData) return null;

  return {
    ...baseData,
    ...customData,
  };
};
