import type { Metadata } from 'next';

interface SocialShareProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  url?: string;
}

export function generateSocialMeta({
  title = 'Austin & Jordyn - Wedding Website',
  description = 'Celebrate with Austin & Jordyn - Wedding photos, guestbook, and memories from our special day',
  image = '/images/social/og-wedding-main.jpg',
  type = 'website',
  url = 'https://www.theporadas.com',
}: SocialShareProps = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      type,
      locale: 'en_US',
      url,
      title,
      description,
      siteName: 'Austin & Jordyn Wedding',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/jpeg',
        },
        {
          url: '/images/social/og-wedding-square.jpg',
          width: 800,
          height: 800,
          alt: title,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@theporadas',
      site: '@theporadas',
    },
    facebook: {
      appId: 'your-facebook-app-id', // Replace with actual Facebook App ID
    },
    verification: {
      google: 'your-google-verification-code',
      other: {
        'facebook-domain-verification': 'your-facebook-domain-verification',
      },
    },
  };
}

// Page-specific social meta generators
export const socialMeta = {
  home: () =>
    generateSocialMeta({
      title: 'Austin & Jordyn - Our Wedding Website',
      description:
        'Join us in celebrating our love story! View our wedding photos, leave messages in our guestbook, and relive the magic of our special day.',
      image: '/images/social/og-home.jpg',
      url: 'https://www.theporadas.com',
    }),

  guestbook: () =>
    generateSocialMeta({
      title: 'Wedding Guestbook - Austin & Jordyn',
      description:
        'Leave a message for the happy couple! Share your congratulations and well wishes in our digital wedding guestbook.',
      image: '/images/social/og-guestbook.jpg',
      url: 'https://www.theporadas.com/guestbook',
    }),

  album: (albumName: string) =>
    generateSocialMeta({
      title: `${albumName} - Austin & Jordyn Wedding Photos`,
      description: `View beautiful photos from ${albumName} at Austin & Jordyn's wedding celebration.`,
      image: '/images/social/og-album.jpg',
      url: `https://www.theporadas.com/albums/${albumName.toLowerCase().replace(/\s+/g, '-')}`,
    }),

  weddingParty: () =>
    generateSocialMeta({
      title: 'Meet Our Wedding Party - Austin & Jordyn',
      description: 'Meet the amazing friends and family who stood with us on our special day.',
      image: '/images/social/og-wedding-party.jpg',
      url: 'https://www.theporadas.com/wedding-party',
    }),

  familyTree: () =>
    generateSocialMeta({
      title: 'Our Family Tree - Austin & Jordyn',
      description: 'Explore the family histories and stories that brought us together.',
      image: '/images/social/og-family.jpg',
      url: 'https://www.theporadas.com/family-tree',
    }),

  map: () =>
    generateSocialMeta({
      title: 'Wedding Locations - Austin & Jordyn',
      description:
        'Discover the special places where our love story unfolded and our wedding celebration took place.',
      image: '/images/social/og-map.jpg',
      url: 'https://www.theporadas.com/map',
    }),
};

// Social sharing utility functions
export const socialShare = {
  facebook: (url: string, title: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`,

  twitter: (url: string, title: string, hashtags: string[] = ['wedding', 'theporadas']) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${hashtags.join(',')}`,

  pinterest: (url: string, title: string, image: string) =>
    `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}&media=${encodeURIComponent(image)}`,

  linkedin: (url: string, title: string, summary: string) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`,

  whatsapp: (url: string, title: string) => {
    const message = `${title} ${url}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  },

  email: (url: string, title: string, body: string) => {
    const emailBody = `${body}\n\n${url}`;
    return `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(emailBody)}`;
  },

  copyLink: async (_url: string) => {
    try {
      await navigator.clipboard.writeText(_url);
      return true;
    } catch {
      // Fallback for older browsers - fallback to false for compatibility
      try {
        const textArea = document.createElement('textarea');
        textArea.value = _url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999); // For mobile devices
        // Use modern selection API instead of deprecated execCommand
        const success = document.getSelection()?.toString() === _url;
        document.body.removeChild(textArea);
        return success;
      } catch {
        return false;
      }
    }
  },
};
