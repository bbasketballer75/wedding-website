#!/usr/bin/env node

import { promises as fs } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '../..');

async function createMissingFiles() {
  console.log('🔧 Creating missing files...\n');

  // Missing CSS files based on error messages
  const missingCssFiles = [
    {
      path: 'src/components/Navbar-premium.css',
      content: `/* Navbar Premium Styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-weight: 700;
  font-size: 1.5rem;
  color: #2d3748;
  text-decoration: none;
}

.navbar-nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-link {
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #e53e3e;
}

.nav-link.active {
  color: #e53e3e;
  font-weight: 600;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }

  .navbar-nav {
    margin-top: 1rem;
    gap: 1rem;
  }
}`,
    },
    {
      path: 'src/components/LandingPage.css',
      content: `/* Landing Page Styles */
.landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 2rem;
}

.landing-title {
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 1rem;
  opacity: 0;
  animation: fadeInUp 1s ease-out 0.5s forwards;
}

.landing-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0;
  animation: fadeInUp 1s ease-out 1s forwards;
}

.landing-button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeInUp 1s ease-out 1.5s forwards;
}

.landing-button:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
    },
    {
      path: 'src/components/MemoryWall.css',
      content: `/* Memory Wall Styles */
.memory-wall {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.memory-wall-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2d3748;
}

.memories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.memory-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.memory-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.memory-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.memory-content {
  padding: 1.5rem;
}

.memory-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 1rem;
}

.memory-author {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.upload-section {
  text-align: center;
  padding: 2rem;
  background: #f7fafc;
  border-radius: 12px;
  margin-top: 2rem;
}

.upload-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.upload-subtitle {
  color: #718096;
  margin-bottom: 2rem;
}`,
    },
    {
      path: 'src/components/NotificationBanner.css',
      content: `/* Notification Banner Styles */
.notification-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 1rem 2rem;
  background: #e53e3e;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-out;
}

.notification-banner.success {
  background: #38a169;
}

.notification-banner.warning {
  background: #d69e2e;
}

.notification-banner.info {
  background: #3182ce;
}

.notification-message {
  flex: 1;
  font-weight: 500;
}

.notification-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin-left: 1rem;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.notification-close:hover {
  opacity: 1;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}`,
    },
    {
      path: 'src/page-components/interactive/GuestbookPage.css',
      content: `/* Guestbook Page Styles */
.guestbook-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.guestbook-header {
  text-align: center;
  margin-bottom: 3rem;
}

.guestbook-title {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.guestbook-subtitle {
  font-size: 1.1rem;
  color: #718096;
  line-height: 1.6;
}

.guestbook-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #e53e3e;
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.submit-button {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background: #c53030;
}

.submit-button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.entry-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #e53e3e;
}

.entry-author {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.entry-message {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.entry-date {
  font-size: 0.875rem;
  color: #a0aec0;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.error-message {
  background: #fed7d7;
  color: #9b2c2c;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
}`,
    },
  ];

  // Missing hooks and utilities
  const missingHooks = [
    {
      path: 'src/hooks/useIntersectionObserver.js',
      content: `import { useEffect, useState } from 'react';

export function useIntersectionObserver(elementRef, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const element = elementRef?.current;

    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
    }, {
      threshold: 0.1,
      rootMargin: '0px',
      ...options
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return { isIntersecting, entry };
}

export default useIntersectionObserver;`,
    },
  ];

  // Create all missing files
  const allFiles = [...missingCssFiles, ...missingHooks];

  for (const { path, content } of allFiles) {
    const fullPath = join(rootDir, path);
    const dir = dirname(fullPath);

    try {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(fullPath, content, 'utf8');
      console.log(`✅ Created: ${path}`);
    } catch (error) {
      console.error(`❌ Failed to create ${path}:`, error.message);
    }
  }

  console.log(`\n🎉 Created ${allFiles.length} missing files!`);
}

await createMissingFiles();

console.log('\n✨ Missing files creation completed!');
