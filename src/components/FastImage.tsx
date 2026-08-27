import React, { useState } from 'react';
import { CATEGORY_FALLBACK_IMAGES } from '../data/products';

interface FastImageProps {
  src?: string;
  alt?: string;
  categoryKey?: string;
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  fit?: 'cover' | 'contain';
}

export const FastImage: React.FC<FastImageProps> = ({
  src,
  alt = 'Product image',
  categoryKey = 'bracelets',
  accentColor = '#C9A876',
  className = '',
  style = {},
  onClick,
  fit = 'cover',
}) => {
  const [loaded, setLoaded] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  // Determine what image source to display: original -> category fallback -> golden jewelry SVG
  const fallbackSrc = CATEGORY_FALLBACK_IMAGES[categoryKey] || CATEGORY_FALLBACK_IMAGES.bracelets;
  const currentSrc = errorCount === 0 && src ? src : errorCount === 1 ? fallbackSrc : null;

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full overflow-hidden flex items-center justify-center bg-[#151517] select-none ${className}`}
      style={style}
    >
      {/* Loading Skeleton */}
      {!loaded && currentSrc && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#17171a] via-[#242429] to-[#17171a] animate-pulse z-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin opacity-50" />
        </div>
      )}

      {currentSrc ? (
        <img
          src={currentSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setErrorCount((prev) => prev + 1);
            setLoaded(true);
          }}
          className={`w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        /* Final fallback: Luxury geometric jewelry vector icon */
        <div className="flex flex-col items-center justify-center p-4 text-center z-10">
          <svg width={56} height={56} viewBox="0 0 100 100" fill="none" className="mb-2 opacity-90 drop-shadow-md">
            <path
              d="M 30 20 L 30 80 L 55 80 C 75 80 85 65 85 50 C 85 35 75 20 55 20 Z"
              stroke={accentColor}
              strokeWidth={7}
              strokeLinejoin="round"
            />
            <circle cx="50" cy="50" r="14" stroke={accentColor} strokeWidth="3" opacity="0.6" strokeDasharray="3 3" />
            <polygon points="50,38 53,47 62,50 53,53 50,62 47,53 38,50 47,47" fill={accentColor} />
          </svg>
          <span className="text-[11px] font-semibold text-[#D4AF37]/80 tracking-wider uppercase">DZIRIA LUXE</span>
        </div>
      )}
    </div>
  );
};
