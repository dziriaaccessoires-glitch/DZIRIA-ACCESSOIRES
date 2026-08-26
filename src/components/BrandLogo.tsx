import React, { useState } from 'react';
import logoImg from '../assets/images/dziria_diamond_logo_1787518310310.jpg';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  className?: string;
  withGlow?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  withGlow = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
    hero: 'w-36 h-36 sm:w-44 sm:h-44 shadow-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div
        className={`relative ${sizeClasses[size]} rounded-full p-[2px] bg-gradient-to-tr from-[#D4AF37] via-[#FFF5D0] to-[#997926] shadow-xl shadow-[#D4AF37]/25 flex-shrink-0 group`}
      >
        {withGlow && (
          <div className="absolute -inset-1 rounded-full bg-[#D4AF37] opacity-30 blur-lg pointer-events-none animate-pulse" />
        )}

        <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0A0C] flex items-center justify-center p-[2px]">
          {!imgError ? (
            <img
              src={logoImg || `${import.meta.env.BASE_URL}dziria_logo.jpg`}
              alt="DZIRIA ACCESSOIRES"
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#1E1E22] to-[#0D0D0F] flex flex-col items-center justify-center text-center p-2">
              <span className="text-[#D4AF37] text-lg font-black leading-none">💎</span>
              <span className="text-[#F5F2ED] text-[9px] font-black tracking-widest mt-1">DZIRIA</span>
            </div>
          )}
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-[#F5F2ED] leading-none">
            DZIRIA
          </span>
          <span className="text-[10px] sm:text-xs tracking-widest text-[#D4AF37] font-extrabold uppercase mt-1">
            ACCESSOIRES
          </span>
        </div>
      )}
    </div>
  );
};
