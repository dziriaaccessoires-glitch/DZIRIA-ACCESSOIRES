import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { FastImage } from './FastImage';

interface LightboxProps {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;

function getDistance(t1: React.Touch, t2: React.Touch) {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const pinchStartDist = useRef(0);
  const pinchStartScale = useRef(1);

  const isZoomed = scale > 1;

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Reset zoom whenever the image changes
  useEffect(() => {
    resetZoom();
  }, [index, resetZoom]);

  if (!images || images.length === 0) return null;

  const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  const zoomIn = () => setScale((s) => clampScale(s + 1));
  const zoomOut = () =>
    setScale((s) => {
      const next = clampScale(s - 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isZoomed) {
      resetZoom();
    } else {
      setScale(2.5);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.4 : 0.4;
    setScale((s) => {
      const next = clampScale(s + delta);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Mouse drag to pan (only while zoomed)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    e.stopPropagation();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...position };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    setPosition({
      x: posStart.current.x + (e.clientX - dragStart.current.x),
      y: posStart.current.y + (e.clientY - dragStart.current.y),
    });
  };

  const stopDragging = () => setIsDragging(false);

  // Touch: pinch to zoom + single-finger pan while zoomed
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStartDist.current = getDistance(e.touches[0], e.touches[1]);
      pinchStartScale.current = scale;
    } else if (e.touches.length === 1 && isZoomed) {
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      posStart.current = { ...position };
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = getDistance(e.touches[0], e.touches[1]);
      const ratio = dist / (pinchStartDist.current || dist);
      setScale(clampScale(pinchStartScale.current * ratio));
    } else if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: posStart.current.x + (e.touches[0].clientX - dragStart.current.x),
        y: posStart.current.y + (e.touches[0].clientY - dragStart.current.y),
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      if (scale <= 1) setPosition({ x: 0, y: 0 });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (!isZoomed) {
        if (e.key === 'ArrowRight') onNext();
        if (e.key === 'ArrowLeft') onPrev();
      }
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, onNext, onPrev, isZoomed]);

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

      {/* Zoom controls */}
      <div
        className="absolute top-5 left-5 z-20 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE}
          aria-label="Zoom out"
          className="w-11 h-11 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:text-white"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <span className="min-w-[3rem] text-center text-xs font-semibold text-white/80 bg-white/10 border border-white/20 rounded-full px-2 py-2.5">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE}
          aria-label="Zoom in"
          className="w-11 h-11 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:text-white"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      {/* Main image container */}
      <div
        className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="max-h-[85vh] w-auto max-w-full overflow-hidden rounded-2xl shadow-2xl"
          onDoubleClick={handleDoubleClick}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
            touchAction: 'none',
          }}
        >
          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              transformOrigin: 'center center',
            }}
          >
            <FastImage
              src={images[index]}
              alt="Expanded view"
              fit="contain"
              className="max-h-[85vh] w-auto max-w-full bg-transparent pointer-events-none"
            />
          </div>
        </div>

        {/* Previous button */}
        {hasMultiple && !isZoomed && (
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
        {hasMultiple && !isZoomed && (
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

      {/* Hint text */}
      {!isZoomed && (
        <div className="absolute bottom-16 inset-x-0 flex justify-center pointer-events-none">
          <span className="text-[11px] text-white/50 bg-black/30 rounded-full px-3 py-1">
            انقري مرتين أو استعملي عجلة الماوس للتكبير
          </span>
        </div>
      )}

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
