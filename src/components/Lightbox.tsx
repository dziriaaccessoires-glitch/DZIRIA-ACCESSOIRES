import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FastImage } from './FastImage';

interface LightboxProps {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}) => {
  if (!images || images.length === 0) return null;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const hasMultiple = images.length > 1;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close fullscreen"
        className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main image container */}
      <div
        className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <FastImage
          src={images[index]}
          alt="Expanded view"
          className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl bg-transparent"
        />

        {/* Previous button */}
        {hasMultiple && (
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next button */}
        {hasMultiple && (
          <button
            type="button"
            onClick={onNext}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Indicator dots */}
      {hasMultiple && (
        <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 pointer-events-none">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
