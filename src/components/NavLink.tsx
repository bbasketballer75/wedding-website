'use client';
/* eslint-disable react/prop-types */

import Link from 'next/link';
import React, { memo } from 'react';

type NavLinkProps = {
  onePage?: boolean;
  href: string;
  label: string;
  role?: string;
  onClick?: (_e: React.MouseEvent<HTMLAnchorElement>) => void;
  'data-track'?: string;
};

const NavLink: React.FC<NavLinkProps & React.AriaAttributes> = memo(
  ({ onePage, href, label, role, onClick, 'data-track': dataTrack, ...ariaProps }) => {
    if (onePage) {
      return (
        <a
          className="nav-link"
          href={href}
          onClick={onClick}
          tabIndex={0}
          role={role}
          data-track={dataTrack || `nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
          {...ariaProps}
        >
          {label}
        </a>
      );
    }
    return (
      <Link
        className="nav-link"
        href={href}
        tabIndex={0}
        role={role}
        data-track={dataTrack || `nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
        {...ariaProps}
      >
        {label}
      </Link>
    );
  }
);

NavLink.displayName = 'NavLink';

export default NavLink;
