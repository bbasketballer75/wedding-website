// Advanced lazy loading utilities for better performance
import { lazy } from 'react';

// Preload critical components
export const preloadComponent = (componentImport) => {
  const componentImporter =
    typeof componentImport === 'function' ? componentImport : () => componentImport;

  // Start loading immediately
  componentImporter();

  // Return lazy component
  return lazy(componentImporter);
};

// Intersection Observer for viewport-based loading
export const createViewportLoader = (threshold = 0.1) => {
  if (typeof window === 'undefined') return () => {};

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Trigger component loading when in viewport
          const loadFn = entry.target.dataset.loadComponent;
          if (loadFn && window[loadFn]) {
            window[loadFn]();
          }
        }
      });
    },
    { threshold }
  );
};

// Resource hints for critical paths
export const addResourceHints = () => {
  if (typeof document === 'undefined') return;

  const criticalResources = [
    { href: '/api/album', as: 'fetch' },
    { href: '/api/guestbook', as: 'fetch' },
    { href: '/images/engagement/PoradaProposal-11.webp', as: 'image' },
  ];

  criticalResources.forEach(({ href, as }) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  });
};
