'use client';
import { useEffect } from 'react';
import { AudioControls } from '../components/AmbientSoundSystem';
import ModernFooter from '../components/ui/ModernFooter';
import VideoHomePage from '../page-components/VideoHomePage';
import '../styles/core/modern-2025-design.css';

export default function HomePage() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    });
  }, []);

  return (
    <div className="modern-app">
      <a href="#main-content" className="modern-skip-link">
        Skip to main content
      </a>

      {/* Floating Audio Controls */}
      <div className="modern-floating-audio">
        <AudioControls />
      </div>

      <main id="main-content" className="modern-main" role="main">
        {/* Video-Centric Homepage */}
        <VideoHomePage />
      </main>

      <ModernFooter />
    </div>
  );
}
