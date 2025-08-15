import Link from 'next/link';
import React, { memo, useCallback } from 'react';
import NavLink from './NavLink';
import './Navbar-premium.css';

type NavbarProps = {
  onePage?: boolean;
};

const Navbar: React.FC<NavbarProps> = memo(({ onePage }) => {
  // Smooth scroll for anchor links
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id?: string) => {
      if (onePage && id) {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [onePage]
  );

  return (
    <nav id="navigation" className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        {onePage ? (
          <a
            className="navbar-brand"
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            tabIndex={0}
            aria-label="Home - Austin & Jordyn Wedding"
            data-track="navbar-home"
          >
            <span className="navbar-logo">Austin & Jordyn</span>
            <span className="navbar-tagline">A Love Story Written in Eternity</span>
          </a>
        ) : (
          <Link
            className="navbar-brand"
            href="/"
            tabIndex={0}
            aria-label="Home - Austin & Jordyn Wedding"
            data-track="navbar-home"
          >
            <span className="navbar-logo">Austin & Jordyn</span>
            <span className="navbar-tagline">Celebrating Our Forever</span>
          </Link>
        )}

        <button
          className="navbar-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => {
            const nav = document.querySelector('.navbar-nav');
            nav?.classList.toggle('open');
          }}
        >
          <span className="navbar-toggle-icon">☰</span>
        </button>

        <ul className="navbar-nav">
          <li className="navbar-nav-item">
            <NavLink
              onePage={onePage}
              href="#home"
              label="Home"
              onClick={(e) => handleNavClick(e, 'home')}
              aria-current="page"
            />
          </li>
          <li className="navbar-nav-item">
            <NavLink
              onePage={onePage}
              href="#memorywall"
              label="Memory Tapestry"
              onClick={(e) => handleNavClick(e, 'memorywall')}
            />
          </li>
          <li className="navbar-nav-item">
            <NavLink
              onePage={onePage}
              href="#album"
              label="Love's Journey"
              onClick={(e) => handleNavClick(e, 'album')}
            />
          </li>
          <li className="navbar-nav-item">
            <NavLink
              onePage={onePage}
              href="#guestbook"
              label="Sacred Messages"
              onClick={(e) => handleNavClick(e, 'guestbook')}
            />
          </li>
          <li className="navbar-nav-item">
            <NavLink
              onePage={onePage}
              href="#family-party"
              label="Our Beloved Circle"
              onClick={(e) => handleNavClick(e, 'family-party')}
            />
          </li>
          <li className="navbar-nav-item">
            <NavLink
              onePage={onePage}
              href="#map"
              label="Sacred Places"
              onClick={(e) => handleNavClick(e, 'map')}
            />
          </li>
        </ul>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
