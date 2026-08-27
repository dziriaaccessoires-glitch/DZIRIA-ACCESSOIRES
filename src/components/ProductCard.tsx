import React, { useState } from 'react';
import { Product, Language } from '../types';
import { STR } from '../data/translations';
import { FastImage } from './FastImage';
import { ChevronRight, ChevronLeft, ShoppingBag, Zap, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  lang: Language;
  onAddToCart: (product: Product, selectedColor?: string, selectedSize?: string) => void;
  onQuickBuy: (product: Product, selectedColor?: string, selectedSize?: string) => void;
  onOpenLightbox: (images: string[], index: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  onAddToCart,
  onQuickBuy,
  onOpenLightbox,
}) => {
  const t = STR[lang];
  const isRTL = t.dir === 'rtl';

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0
      ? product.colors.find((c) => c.available !== false)?.hex
      : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [validationError, setValidationError] = useState(false);
  const [isAddedFlash, setIsAddedFlash] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [''];
  const hasMultipleImages = images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  // Swipe / drag support to switch between product images
  const SWIPE_THRESHOLD = 40;
  const dragStartX = React.useRef<number | null>(null);
  const dragDeltaX = React.useRef(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const goToNext = () => setActiveImageIdx((prev) => (prev + 1) % images.length);
  const goToPrev = () => setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);

  const handleDragStart = (clientX: number) => {
    if (!hasMultipleImages) return;
    dragStartX.current = clientX;
    dragDeltaX.current = 0;
    setIsSwiping(true);
  };

  const handleDragMove = (clientX: number) => {
    if (dragStartX.current === null) return;
    dragDeltaX.current = clientX - dragStartX.current;
  };

  const handleDragEnd = () => {
    if (dragStartX.current === null) return;
    const delta = dragDeltaX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      const swipedLeft = delta < 0;
      if (isRTL ? swipedLeft : !swipedLeft) {
        goToPrev();
      } else {
        goToNext();
      }
    }
    dragStartX.current = null;
    dragDeltaX.current = 0;
    setIsSwiping(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleDragEnd();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX.current !== null) handleDragMove(e.clientX);
  };
  const handleMouseUp = () => handleDragEnd();
  const handleMouseLeave = () => {
    if (dragStartX.current !== null) handleDragEnd();
  };

  const validateSelection = (): boolean => {
    const needsColor = product.colors && product.colors.length > 0;
    const needsSize = product.sizes && product.sizes.length > 0;

    if ((needsColor && !selectedColor) || (needsSize && !selectedSize)) {
      setValidationError(true);
      setTimeout(() => setValidationError(false), 2000);
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!product.available) return;
    if (!validateSelection()) return;
    onAddToCart(product, selectedColor, selectedSize);
    setIsAddedFlash(true);
    setTimeout(() => setIsAddedFlash(false), 1200);
  };

  const handleBuyNow = () => {
    if (!product.available) return;
    if (!validateSelection()) return;
    onQuickBuy(product, selectedColor, selectedSize);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      className={`group relative rounded-2xl bg-[#131315] border ${
        product.available ? 'border-[#242428] hover:border-[#D4AF37]/60' : 'border-[#1f1f22] opacity-60'
      } flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/5`}
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-square bg-[#18181b] overflow-hidden">
        {/* Out of stock overlay */}
        {!product.available && (
          <div className="absolute inset-0 bg-black/75 z-20 flex items-center justify-center p-3">
            <span className="px-3 py-1 rounded-full bg-[#E07A6B]/20 border border-[#E07A6B] text-[#E07A6B] font-bold text-xs">
              {t.outOfStock}
            </span>
          </div>
        )}

        {/* Badges / Discount tag */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
          {product.badge ? (
            <span className="px-2.5 py-1 rounded-lg bg-[#D4AF37] text-[#0A0A0A] font-extrabold text-[11px] shadow-md">
              {product.badge[lang]}
            </span>
          ) : discount ? (
            <span className="px-2 py-0.5 rounded-md bg-[#E07A6B] text-white font-bold text-[11px] shadow-sm">
              -{discount}%
            </span>
          ) : (
            <span />
          )}

          {/* Quick View zoom icon button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLightbox(images, activeImageIdx);
            }}
            className="w-8 h-8 rounded-full bg-[#0A0A0A]/70 backdrop-blur-md text-[#F5F2ED] border border-[#ffffff]/20 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0A0A0A] transition-colors pointer-events-auto cursor-pointer"
            title={t.quickView}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Image */}
        <div
          className="w-full h-full cursor-pointer select-none"
          style={{ touchAction: hasMultipleImages ? 'pan-y' : undefined }}
          onClick={() => {
            if (Math.abs(dragDeltaX.current) > SWIPE_THRESHOLD) return;
            onOpenLightbox(images, activeImageIdx);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <FastImage
            src={images[activeImageIdx]}
            alt={product.name[lang]}
            categoryKey={product.categoryKey}
            accentColor={product.accentColor}
            className={`transition-transform duration-500 ${isSwiping ? '' : 'group-hover:scale-105'}`}
          />
        </div>

        {/* Image Gallery Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={isRTL ? nextImage : prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0A0A0A]/70 text-white flex items-center justify-center border border-white/10 hover:bg-[#D4AF37] hover:text-black transition-all opacity-80 hover:opacity-100 z-10 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={isRTL ? prevImage : nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0A0A0A]/70 text-white flex items-center justify-center border border-white/10 hover:bg-[#D4AF37] hover:text-black transition-all opacity-80 hover:opacity-100 z-10 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === activeImageIdx ? 'bg-[#D4AF37] w-3.5' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Details Body */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#C9A876] mb-1.5">
            <span>{product.category[lang]}</span>
            {product.rating && (
              <span className="flex items-center gap-1 text-[#E5C378]">
                <Star className="w-3 h-3 fill-[#E5C378]" />
                <span>{product.rating}</span>
                {product.soldCount && <span className="text-[#6B6B6B]">({product.soldCount})</span>}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h4 className="text-sm sm:text-base font-bold text-[#F5F2ED] mb-2 leading-snug line-clamp-2">
            {product.name[lang]}
          </h4>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-black text-[#E5C378]">
              {product.price.toLocaleString()} {t.currency}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#737373] line-through font-medium">
                {product.originalPrice.toLocaleString()} {t.currency}
              </span>
            )}
          </div>

          {/* Color Selection Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-3">
              <div className="text-[11px] text-[#8A8A8A] font-medium mb-1.5 flex justify-between">
                <span>{t.colorLabel}:</span>
                <span className="text-[#D4AF37]">
                  {product.colors.find((c) => c.hex === selectedColor)?.name[lang]}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {product.colors.map((c) => {
                  const isSelected = selectedColor === c.hex;
                  const isAvailable = c.available !== false;

                  return (
                    <button
                      key={c.hex}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedColor(c.hex)}
                      title={c.name[lang]}
                      className={`relative w-6 h-6 rounded-full border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 scale-110'
                          : 'border-[#38383e] hover:scale-105'
                      } ${!isAvailable ? 'opacity-30 cursor-not-allowed' : ''}`}
                      style={{ background: c.hex }}
                    >
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-red-500/80 rotate-45" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-3">
              <div className="text-[11px] text-[#8A8A8A] font-medium mb-1.5">{t.sizeLabel}:</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.sizes.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#E5C378] text-[#0A0A0A] border-[#E5C378]'
                          : 'bg-[#1a1a1d] text-[#F5F2ED] border-[#313136] hover:border-[#666]'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Validation Warning */}
          {validationError && (
            <div className="text-xs text-[#E07A6B] bg-[#E07A6B]/10 p-2 rounded-lg mb-2 text-center border border-[#E07A6B]/30 animate-shake">
              {t.selectionRequired}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#202024]">
          <button
            type="button"
            disabled={!product.available}
            onClick={handleAdd}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-semibold text-xs sm:text-sm border transition-all cursor-pointer ${
              isAddedFlash
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                : 'bg-[#1b1b1e] hover:bg-[#25252a] text-[#F5F2ED] border-[#2e2e34]'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isAddedFlash ? t.added : t.addToCart}</span>
          </button>

          <button
            type="button"
            disabled={!product.available}
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C9A876] hover:brightness-110 text-[#0A0A0A] font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-[#0A0A0A]" />
            <span>{t.quickOrder}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
