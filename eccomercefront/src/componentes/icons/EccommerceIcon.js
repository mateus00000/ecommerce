import React from 'react';

const EccomerceIcon = ({ src, alt, width, height, style }) => {
  return (
    <img 
      src={src} 
      alt={alt || 'Icon'} 
      width={width || '100px'} 
      height={height || '100px'} 
      style={style}
    />
  );
}

export default EccomerceIcon;
