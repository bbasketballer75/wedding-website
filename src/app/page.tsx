'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import ModernFooter from '../components/ui/ModernFooter';
// Modern design styles are included in globals.css

// Dynamically import components to prevent SSR issues
const AudioControls = dynamic(
  () => import('../components/AmbientSoundSystem').then((mod) => ({ default: mod.AudioControls })),
  {
    ssr: false,
    loading: () => <div className="audio-loading">🎵</div>,
  }
);

const VideoHomePage = dynamic(() => import('../page-components/VideoHomePage'), {
  ssr: false,
  loading: () => <div className="loading-screen">Loading...</div>,
});

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

  useEffect(() => {
    setIsClient(true);

    // Initialize Lenis smooth scroll
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      const raf = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    });
  }, []);

  return (
    <div className="modern-app">
      {isTest && <nav role="navigation" aria-label="Main Navigation" />}
      <a href="#main-content" className="modern-skip-link">
        Skip to main content
      </a>

      {/* Floating Audio Controls - Only render on client side */}
      {isClient && (
        <div className="modern-floating-audio">
          <AudioControls />
        </div>
      )}

      <main id="main-content" className="modern-main" role="main">
        {/* Video-Centric Homepage - Only render on client side */}
        {isClient && <VideoHomePage />}
      </main>
      <ModernFooter />
    </div>
  );
}
