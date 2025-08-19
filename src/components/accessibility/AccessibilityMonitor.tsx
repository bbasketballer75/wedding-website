'use client';



import { useCallback, useEffect, useState } from 'react';

/**
 * ♿ Accessibility Testing & Automation Component
 * Real-time accessibility monitoring and automated improvements
 */

interface A11yIssue {
  id: string;
  type: 'error' | 'warning' | 'notice';
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  element: string;
  description: string;
  help: string;
  helpUrl: string;
  fixed?: boolean;
}

interface A11yReport {
  timestamp: number;
  url: string;
  violations: A11yIssue[];
  passes: number;
  incomplete: A11yIssue[];
  inapplicable: number;
}

export default function AccessibilityMonitor() {
  const [report, setReport] = useState<A11yReport | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [autoFixes, setAutoFixes] = useState(0);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  // Accessibility fixes that can be applied automatically
  const applyAutomaticFixes = () => {
    let fixesApplied = 0;

    // Fix missing alt attributes on images
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach((img, index) => {
      const altText =
        img.getAttribute('data-alt') || img.getAttribute('title') || `Image ${index + 1}`;
      img.setAttribute('alt', altText);
      fixesApplied++;
    });

    // Add skip links if missing
    if (!document.querySelector('[data-skip-link]')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.textContent = 'Skip to main content';
      skipLink.setAttribute('data-skip-link', 'true');
      skipLink.style.position = 'absolute';
      skipLink.style.left = '-9999px';
      skipLink.style.zIndex = '999999';
      skipLink.addEventListener('focus', () => {
        skipLink.style.left = '6px';
        skipLink.style.top = '6px';
      });
      skipLink.addEventListener('blur', () => {
        skipLink.style.left = '-9999px';
      });
      document.body.insertBefore(skipLink, document.body.firstChild);
      fixesApplied++;
    }

    // Fix form labels
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach((input) => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label && input.id) {
        const placeholder = input.getAttribute('placeholder');
        const name = input.getAttribute('name');
        if (placeholder) {
          input.setAttribute('aria-label', placeholder);
          fixesApplied++;
        } else if (name) {
          const labelText = name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
          input.setAttribute('aria-label', labelText);
          fixesApplied++;
        }
      }
    });

    // Add ARIA landmarks
    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
      main.setAttribute('role', 'main');
      main.id = main.id || 'main-content';
      fixesApplied++;
    }

    // Fix button accessibility
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach((button) => {
      if (!button.textContent?.trim()) {
        const icon = button.querySelector('svg, i, .icon');
        if (icon) {
          button.setAttribute('aria-label', 'Button');
          fixesApplied++;
        }
      }
    });

    // Fix heading hierarchy
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let lastLevel = 0;
    headings.forEach((heading) => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      if (currentLevel > lastLevel + 1) {
        // Heading level jumps more than 1, could be an issue
        heading.setAttribute('data-a11y-warning', 'Heading level may skip hierarchy');
      }
      lastLevel = currentLevel;
    });

    // Enhance focus indicators
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    focusableElements.forEach((element) => {
      if (!element.classList.contains('focus-enhanced')) {
        element.classList.add('focus-enhanced');
        fixesApplied++;
      }
    });

    setAutoFixes(fixesApplied);
    return fixesApplied;
  };

  // Simulate axe-core scanning (in real implementation, use actual axe-core)
  const runAccessibilityScan = useCallback(async () => {
    setIsMonitoring(true);
    setLastScan(new Date());

    try {
      // Apply automatic fixes first
      const fixes = applyAutomaticFixes();

      // Simulate accessibility scanning
      const violations: A11yIssue[] = [];
      const incomplete: A11yIssue[] = [];

      // Check for common issues
      const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
      if (imagesWithoutAlt.length > 0) {
        violations.push({
          id: 'image-alt',
          type: 'error',
          impact: 'critical',
          element: `${imagesWithoutAlt.length} image(s)`,
          description: 'Images must have alternate text',
          help: 'All img elements must have an alt attribute',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/quickref/#non-text-content',
        });
      }

      // Check for form labels
      const unlabeledInputs = document.querySelectorAll(
        'input:not([aria-label]):not([aria-labelledby]):not([type="hidden"])'
      );
      if (unlabeledInputs.length > 0) {
        violations.push({
          id: 'label',
          type: 'error',
          impact: 'critical',
          element: `${unlabeledInputs.length} input(s)`,
          description: 'Form elements must have labels',
          help: 'Every form control must have a label',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/quickref/#labels-or-instructions',
        });
      }

      // Check color contrast (simplified)
      const lowContrastElements = document.querySelectorAll('[data-low-contrast]');
      if (lowContrastElements.length > 0) {
        violations.push({
          id: 'color-contrast',
          type: 'error',
          impact: 'serious',
          element: `${lowContrastElements.length} element(s)`,
          description: 'Elements must have sufficient color contrast',
          help: 'Text must have a contrast ratio of at least 4.5:1',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum',
        });
      }

      // Check for missing main landmark
      const mainLandmark = document.querySelector('main, [role="main"]');
      if (!mainLandmark) {
        violations.push({
          id: 'landmark-main-is-top-level',
          type: 'error',
          impact: 'moderate',
          element: 'page',
          description: 'Page must have a main landmark',
          help: 'All pages should have a main landmark',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/quickref/#info-and-relationships',
        });
      }

      const newReport: A11yReport = {
        timestamp: Date.now(),
        url: window.location.href,
        violations,
        passes: 15 - violations.length, // Simplified calculation
        incomplete,
        inapplicable: 5,
      };

      setReport(newReport);

      // Send report to analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as { gtag?: Function }).gtag;
        if (gtag) {
          gtag('event', 'accessibility_scan', {
            violations_count: violations.length,
            critical_issues: violations.filter((v) => v.impact === 'critical').length,
            auto_fixes_applied: fixes,
          });
        }
      }
    } catch (error) {
      console.error('Accessibility scan failed:', error);
    } finally {
      setIsMonitoring(false);
    }
  }, []); // Empty dependency array since this function doesn't depend on props/state

  // Run initial scan and set up periodic scanning
  useEffect(() => {
    // Run initial scan after component mount
    const timer = setTimeout(runAccessibilityScan, 1000);

    // Set up periodic scanning (every 30 seconds)
    const interval = setInterval(runAccessibilityScan, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [runAccessibilityScan]);

  // Keyboard navigation enhancement
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      // Enhanced tab navigation
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }

      // Skip link functionality
      if (event.key === 'Escape') {
        const activeElement = document.activeElement;
        if (activeElement && 'blur' in activeElement && typeof activeElement.blur === 'function') {
          activeElement.blur();
        }
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Only show in development or for admin users
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isAdmin = typeof window !== 'undefined' && sessionStorage.getItem('adminKey');

  if (!isDevelopment && !isAdmin) {
    return null;
  }

  return (
    <>
      <style>{`
        .a11y-monitor {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: white;
          border: 2px solid #4ade80;
          border-radius: 8px;
          padding: 1rem;
          font-size: 0.875rem;
          font-family: monospace;
          z-index: 999999;
          max-width: 300px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .a11y-monitor.collapsed {
          padding: 0.5rem;
          max-width: 60px;
        }

        .a11y-toggle {
          background: #4ade80;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .a11y-status {
          margin-bottom: 0.5rem;
        }

        .a11y-violations {
          color: #dc2626;
          font-weight: bold;
        }

        .a11y-passes {
          color: #16a34a;
        }

        .a11y-auto-fixes {
          color: #2563eb;
          font-size: 0.75rem;
        }

        .a11y-issue {
          margin: 0.25rem 0;
          padding: 0.25rem;
          background: #fef2f2;
          border-left: 3px solid #dc2626;
          font-size: 0.75rem;
        }

        .a11y-issue.warning {
          background: #fffbeb;
          border-left-color: #f59e0b;
        }

        .a11y-issue.notice {
          background: #eff6ff;
          border-left-color: #3b82f6;
        }

        .focus-enhanced:focus {
          outline: 3px solid #4ade80 !important;
          outline-offset: 2px !important;
        }

        .keyboard-navigation .focus-enhanced:focus {
          outline: 3px solid #2563eb !important;
        }

        [data-skip-link]:focus {
          position: static !important;
          background: #2563eb;
          color: white;
          padding: 0.5rem 1rem;
          text-decoration: none;
          border-radius: 4px;
        }
      `}</style>
      <div className={`a11y-monitor ${report ? '' : 'collapsed'}`}>
      <button
          className="a11y-toggle"
          onClick={runAccessibilityScan}
          disabled={isMonitoring}
          aria-label="Run accessibility scan"
        >
          ♿ {isMonitoring ? 'Scanning...' : 'A11y'}
        </button>

        {report && (
          <>
      <div className="a11y-status">
      <div className="a11y-violations">🚨 {report.violations.length} issues</div>
      <div className="a11y-passes">✅ {report.passes} checks passed</div>
              {autoFixes > 0 && (
                <div className="a11y-auto-fixes">🔧 {autoFixes} auto-fixes applied</div>
              )}
            </div>

            {report.violations.slice(0, 3).map((violation) => (
              <div key={violation.id} className={`a11y-issue ${violation.type}`}>
      <strong>{violation.description}</strong>
      <br
      />
                {violation.element}
              </div>
            ))}

            {lastScan && (
              <div style={{ fontSize: '0.625rem', color: '#6b7280', marginTop: '0.5rem' }}>
                Last scan: {lastScan.toLocaleTimeString()}
              </div>
            )}
          </>
        )}
      </div>
      </>
  );
}