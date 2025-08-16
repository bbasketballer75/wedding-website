'use client';

import { usePathname } from 'next/navigation';
import { SEOManager } from '../../utils/seo/SEOManager';

/**
 * 🏗️ Structured Data Component
 * Automatically generates JSON-LD structured data based on current page
 */

interface StructuredDataProps {
  type?: 'Event' | 'Person' | 'Organization' | 'PhotoGallery' | 'BlogPosting';
  customData?: Record<string, unknown>;
  includeBreadcrumbs?: boolean;
  includeOrganization?: boolean;
}

export default function StructuredData({
  type,
  customData = {},
  includeBreadcrumbs = true,
  includeOrganization = true,
}: StructuredDataProps) {
  const pathname = usePathname();

  // Generate page-specific structured data
  const getPageStructuredData = () => {
    const pageKey = pathname === '/' ? 'home' : pathname.slice(1);

    switch (pageKey) {
      case 'home':
        return SEOManager.generateStructuredData({
          type: 'Event',
          data: {
            name: 'Austin & Jordyn Porada Wedding Celebration',
            description:
              'Join us for our special day as we celebrate our love and commitment in a beautiful ceremony and reception.',
            startDate: '2025-09-20T16:00:00-04:00',
            endDate: '2025-09-20T23:00:00-04:00',
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            venueName: 'Beautiful Wedding Venue',
            city: 'Wedding City',
            state: 'State',
            image: 'https://www.theporadas.com/images/hero/wedding-cover.jpg',
            ...customData,
          },
        });

      case 'story':
        return SEOManager.generateStructuredData({
          type: 'BlogPosting',
          data: {
            headline: 'Our Love Story - Austin & Jordyn',
            description:
              'The beautiful journey of how Austin and Jordyn met, fell in love, and decided to spend their lives together.',
            author: 'Austin & Jordyn Porada',
            datePublished: '2025-01-01',
            dateModified: new Date().toISOString(),
            url: 'https://www.theporadas.com/story',
            image: 'https://www.theporadas.com/images/story/love-story.jpg',
            ...customData,
          },
        });

      case 'gallery':
        return SEOManager.generateStructuredData({
          type: 'PhotoGallery',
          data: {
            name: 'Wedding Photo Gallery',
            description: 'Beautiful engagement and wedding photos capturing our special moments',
            url: 'https://www.theporadas.com/gallery',
            photos: [
              {
                url: 'https://www.theporadas.com/images/gallery/engagement-1.jpg',
                caption: 'Engagement photos',
                description: 'Beautiful engagement session photos',
              },
              // Add more photos dynamically in real implementation
            ],
            ...customData,
          },
        });

      case 'wedding-party':
        return SEOManager.generateStructuredData({
          type: 'Organization',
          data: {
            name: 'Austin & Jordyn Wedding Party',
            description: 'Meet the amazing people standing with us on our special day',
            url: 'https://www.theporadas.com/wedding-party',
            members: [
              {
                '@type': 'Person',
                name: 'Austin Porada',
                jobTitle: 'Groom',
              },
              {
                '@type': 'Person',
                name: 'Jordyn Porada',
                jobTitle: 'Bride',
              },
            ],
            ...customData,
          },
        });

      default:
        if (type && customData) {
          return SEOManager.generateStructuredData({ type, data: customData });
        }
        return null;
    }
  };

  // Generate breadcrumb data
  const getBreadcrumbData = () => {
    if (!includeBreadcrumbs) return null;

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', url: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const name = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbs.push({ name, url: currentPath });
    });

    return SEOManager.generateBreadcrumbs(breadcrumbs);
  };

  // Generate organization data
  const getOrganizationData = () => {
    if (!includeOrganization) return null;

    return SEOManager.generateStructuredData({
      type: 'Organization',
      data: {
        name: 'The Poradas Wedding',
        url: 'https://www.theporadas.com',
        logo: 'https://www.theporadas.com/images/logo.png',
        sameAs: ['https://instagram.com/theporadas', 'https://facebook.com/theporadas'],
        founder: [
          {
            '@type': 'Person',
            name: 'Austin Porada',
          },
          {
            '@type': 'Person',
            name: 'Jordyn Porada',
          },
        ],
      },
    });
  };

  const pageStructuredData = getPageStructuredData();
  const breadcrumbData = getBreadcrumbData();
  const organizationData = getOrganizationData();

  return (
    <>
      {pageStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: pageStructuredData }}
        />
      )}

      {breadcrumbData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbData }} />
      )}

      {organizationData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationData }} />
      )}
    </>
  );
}
