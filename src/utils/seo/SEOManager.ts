/**
 * 🔍 SEO Enhancement Utilities
 * Advanced metadata generation and structured data for wedding website
 */

import { Metadata } from 'next';

interface WeddingPageMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
}

interface PhotoData {
  url: string;
  caption?: string;
  description?: string;
}

interface StructuredDataProps {
  type: 'Event' | 'Person' | 'Organization' | 'PhotoGallery' | 'BlogPosting';
  data: Record<string, unknown>;
}

export class SEOManager {
  private static readonly BASE_URL = 'https://www.theporadas.com';
  private static readonly SITE_NAME = 'Austin & Jordyn Porada Wedding';
  private static readonly DEFAULT_IMAGE = '/images/hero/wedding-cover.jpg';

  /**
   * Generate comprehensive metadata for Next.js pages
   */
  static generateMetadata({
    title,
    description,
    path,
    image = SEOManager.DEFAULT_IMAGE,
    type = 'website',
    publishedTime,
    modifiedTime,
    section,
  }: WeddingPageMeta): Metadata {
    const fullTitle = `${title} | ${SEOManager.SITE_NAME}`;
    const fullUrl = `${SEOManager.BASE_URL}${path}`;
    const fullImageUrl = image.startsWith('http') ? image : `${SEOManager.BASE_URL}${image}`;

    return {
      title: fullTitle,
      description,

      // Open Graph
      openGraph: {
        title: fullTitle,
        description,
        url: fullUrl,
        siteName: SEOManager.SITE_NAME,
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: 'en_US',
        type: type as 'website' | 'article',
        ...(publishedTime && { publishedTime }),
        ...(modifiedTime && { modifiedTime }),
        ...(section && { section }),
      },

      // Twitter
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description,
        images: [fullImageUrl],
        creator: '@theporadas',
      },

      // Additional meta tags
      other: {
        'og:image:secure_url': fullImageUrl,
        'og:image:type': 'image/jpeg',
        'theme-color': '#8b7a8a',
        'msapplication-TileColor': '#8b7a8a',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        'format-detection': 'telephone=no',
      },

      // Canonical URL
      alternates: {
        canonical: fullUrl,
      },

      // Robots
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
    };
  }

  /**
   * Generate JSON-LD structured data
   */
  static generateStructuredData({ type, data }: StructuredDataProps): string {
    const baseContext = {
      '@context': 'https://schema.org',
      '@type': type,
    };

    switch (type) {
      case 'Event':
        return JSON.stringify({
          ...baseContext,
          name: data.name || 'Austin & Jordyn Porada Wedding',
          description:
            data.description ||
            'Join us for our special day as we celebrate our love and commitment.',
          startDate: data.startDate || '2025-09-20T16:00:00-04:00',
          endDate: data.endDate || '2025-09-20T23:00:00-04:00',
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: data.venueName || 'Wedding Venue',
            address: {
              '@type': 'PostalAddress',
              addressLocality: data.city || 'City',
              addressRegion: data.state || 'State',
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
          image: data.image || SEOManager.DEFAULT_IMAGE,
          url: 'https://www.theporadas.com',
        });

      case 'Person':
        return JSON.stringify({
          ...baseContext,
          name: data.name,
          givenName: data.givenName,
          familyName: data.familyName,
          spouse: data.spouse,
          image: data.image,
          url: data.url || 'https://www.theporadas.com',
          sameAs: data.socialProfiles || [],
        });

      case 'PhotoGallery':
        return JSON.stringify({
          ...baseContext,
          '@type': 'ImageGallery',
          name: data.name || 'Wedding Photo Gallery',
          description: data.description || 'Beautiful moments from our special day',
          url: data.url,
          associatedMedia: Array.isArray(data.photos)
            ? (data.photos as PhotoData[]).map((photo) => ({
                '@type': 'ImageObject',
                url: photo.url,
                caption: photo.caption,
                description: photo.description,
              }))
            : [],
        });

      case 'BlogPosting':
        return JSON.stringify({
          ...baseContext,
          headline: data.headline,
          description: data.description,
          image: data.image,
          author: {
            '@type': 'Person',
            name: data.author || 'Austin & Jordyn Porada',
          },
          publisher: {
            '@type': 'Organization',
            name: 'The Poradas',
            logo: {
              '@type': 'ImageObject',
              url: `${SEOManager.BASE_URL}/images/logo.png`,
            },
          },
          datePublished: data.datePublished,
          dateModified: data.dateModified,
          url: data.url,
        });

      default:
        return JSON.stringify({
          ...baseContext,
          ...data,
        });
    }
  }

  /**
   * Generate breadcrumb structured data
   */
  static generateBreadcrumbs(items: Array<{ name: string; url: string }>): string {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${SEOManager.BASE_URL}${item.url}`,
      })),
    });
  }

  /**
   * Generate FAQ structured data
   */
  static generateFAQ(faqs: Array<{ question: string; answer: string }>): string {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  /**
   * Get meta tags for specific pages
   */
  static getPageMeta(page: string): WeddingPageMeta {
    const pageMeta: Record<string, WeddingPageMeta> = {
      home: {
        title: 'Welcome to Our Wedding',
        description:
          'Join Austin & Jordyn Porada as we celebrate our love story and wedding journey. Explore our photo galleries, RSVP, and share in our special moments.',
        path: '/',
        image: '/images/hero/wedding-cover.jpg',
      },

      story: {
        title: 'Our Love Story',
        description:
          'Discover how Austin and Jordyn met, fell in love, and decided to spend their lives together. Read about their journey to the altar.',
        path: '/story',
        image: '/images/story/love-story.jpg',
        type: 'article',
        section: 'Love Story',
      },

      gallery: {
        title: 'Photo Gallery',
        description:
          'Browse through beautiful photos from our engagement, wedding preparations, and special moments together.',
        path: '/gallery',
        image: '/images/gallery/gallery-preview.jpg',
      },

      guestbook: {
        title: 'Wedding Guestbook',
        description:
          'Leave us a message, share your favorite memory, or upload a photo. Your words and memories mean the world to us.',
        path: '/guestbook',
        image: '/images/guestbook/guestbook-preview.jpg',
      },

      'wedding-party': {
        title: 'Our Wedding Party',
        description:
          'Meet the amazing people who will be standing with us on our special day. Learn about our bridesmaids, groomsmen, and family.',
        path: '/wedding-party',
        image: '/images/wedding-party/wedding-party.jpg',
      },

      registry: {
        title: 'Wedding Registry',
        description:
          'Help us start our new life together with gifts from our carefully curated wedding registry.',
        path: '/registry',
        image: '/images/registry/registry-preview.jpg',
      },

      rsvp: {
        title: 'RSVP',
        description:
          'Please let us know if you can join us for our special day. Your presence would mean everything to us.',
        path: '/rsvp',
        image: '/images/rsvp/rsvp-preview.jpg',
      },
    };

    return (
      pageMeta[page] || {
        title: 'Austin & Jordyn Wedding',
        description: 'Join us as we celebrate our love and commitment.',
        path: '/',
      }
    );
  }

  /**
   * Generate sitemap data
   */
  static generateSitemapData() {
    const pages = [
      { url: '/', priority: 1.0, changeFreq: 'weekly' },
      { url: '/story', priority: 0.8, changeFreq: 'monthly' },
      { url: '/gallery', priority: 0.9, changeFreq: 'weekly' },
      { url: '/guestbook', priority: 0.7, changeFreq: 'daily' },
      { url: '/wedding-party', priority: 0.6, changeFreq: 'monthly' },
      { url: '/registry', priority: 0.5, changeFreq: 'monthly' },
      { url: '/rsvp', priority: 0.9, changeFreq: 'weekly' },
    ];

    return pages.map((page) => ({
      url: `${SEOManager.BASE_URL}${page.url}`,
      lastModified: new Date(),
      changeFrequency: page.changeFreq as 'weekly' | 'monthly' | 'daily',
      priority: page.priority,
    }));
  }
}

export default SEOManager;
