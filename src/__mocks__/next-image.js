// Simple next/image mock for jsdom/Vitest with minimal prop support
import PropTypes from 'prop-types';
import React from 'react';

const NextImage = ({ src, alt = '', fill, width, height, sizes, style, ...rest }) => {
  const resolvedStyle = {
    ...(style || {}),
    objectFit: style?.objectFit,
  };
  // If `fill` is set, ignore width/height; otherwise pass through
  const imgProps = fill
    ? { style: resolvedStyle }
    : { width: width || 1, height: height || 1, style: resolvedStyle };

  return React.createElement('img', {
    src: typeof src === 'string' ? src : '',
    alt,
    sizes,
    ...imgProps,
    ...rest,
  });
};

export default NextImage;

NextImage.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  alt: PropTypes.string,
  fill: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sizes: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  style: PropTypes.object,
};
