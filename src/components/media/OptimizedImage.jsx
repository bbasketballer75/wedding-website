import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

/**
 * Advanced Image Component with lazy loading, blur placeholder, and error handling
 */
export function OptimizedImage({
  src,
  alt,
  className = '',
  priority = false,
  sizes,
  onLoad,
  onError,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  // Removed unused generateSrcSet helper (Next.js handles srcset internally)

  // Blur placeholder (base64 encoded tiny image)
  const blurDataURL =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmM2Y0ZjY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTVlN2ViO3N0b3Atb3BhY2l0eToxIiAvPjwvTGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiIC8+PC9zdmc+';

  if (hasError) {
    return (
      <div
        ref={imgRef}
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        {...props}
      >
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isVisible && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={Array.isArray(sizes) ? sizes.join(', ') : sizes}
          placeholder="blur"
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          onError={handleError}
          style={{ objectFit: 'cover' }}
          loading={priority ? 'eager' : 'lazy'}
          {...props}
        />
      )}
      {!isLoaded && isVisible && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

/**
 * Progressive Image Enhancement Hook
 */
export function useProgressiveImage(src) {
  const [imgSrc, setImgSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImgSrc(src);
      setIsLoading(false);
    };
    img.src = src;
  }, [src]);

  return { imgSrc, isLoading };
}

/**
 * Image Preloader for critical images
 */
export function preloadImages(imageSrcs) {
  imageSrcs.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// PropTypes validation
OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  priority: PropTypes.bool,
  sizes: PropTypes.arrayOf(PropTypes.number),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

OptimizedImage.defaultProps = {
  className: '',
  priority: false,
  sizes: undefined,
  onLoad: undefined,
  onError: undefined,
};

export default OptimizedImage;
