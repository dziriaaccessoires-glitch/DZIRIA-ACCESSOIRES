import React from 'react';
import { Product, Language } from '../types';
import { STR } from '../data/translations';
import { FastImage } from './FastImage';
import { getThumbSrc } from '../utils/image';
import { Flame, Sparkles, Clock, ShoppingBag, Zap, Check } from 'lucide-react';

interface PromotionsSectionProps {
  products: Product[];
  lang: Language;
  onAddToCart: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  onOpenImage: (images: string[], index: number) => void;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({
  products,
  lang,
  onAddToCart,
  onQuickBuy,
  onOpenImage,
}) => {
  const t = STR[lang];
  const isRTL = t.dir === 'rtl';

  const promoProducts = products.filter((p) => p.isPromo || p.categoryKey === 'promotions');

  if (promoProducts.length === 0) return null;

  return (
    <section id="promotions" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Promotion Section Header Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 mb-8 overflow-hidden border border-[#D4AF37]/30 bg-gradient-to-br from-[#1c1811] via-[#141312] to-[#0d0d0f] shadow-2xl">
        {/* Background glow accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C9A876]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C378] text-xs sm:text-sm font-bold tracking-wide mb-3">
              <Flame className="w-4 h-4 text-[#E5C378] animate-bounce" />
              <span>{t.promotionsTitle}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F9F7F2] tracking-tight leading-tight">
              {lang === 'ar' ? 'باقات وعروض التوفير الحصرية' : 'Packs & Promotions Exclusives'}
            </h2>
            <p className="text-sm sm:text-base text-[#A8A8A8] mt-2 max-w-2xl leading-relaxed">
              {t.promotionsSub}
            </p>
          </div>

          {/* Urgency Badge */}
          <div className="flex items-center gap-3 bg-[#0d0d0f]/80 backdrop-blur-md px-4 py-3 rounded-xl border border-[#332f28] self-start md:self-auto">
            <Clock className="w-5 h-5 text-[#E5C378]" />
            <div>
              <div className="text-xs text-[#8A8A8A] font-medium">
                {lang === 'ar' ? 'مدة سريان العرض' : 'Validité de l’offre'}
              </div>
              <div className="text-sm font-bold text-[#E5C378]">
                {lang === 'ar' ? 'حتى نفاد الكمية المتوفرة ⏳' : 'Jusqu’à épuisement du stock ⏳'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promoProducts.map((p) => {
          const discount = p.originalPrice
            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
            : null;
          const saving = p.originalPrice ? p.originalPrice - p.price : null;

          return (
            <div
              key={p.id}
              className={`group relative rounded-2xl bg-[#121214] border ${
                p.available ? 'border-[#D4AF37]/35 hover:border-[#D4AF37]' : 'border-[#262629] opacity-60'
              } p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/5 flex flex-col justify-between overflow-hidden`}
            >
              {/* Top Discount Tag */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B38F2D] text-[#0A0A0A] font-extrabold text-xs shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-[#0A0A0A]" />
                  {p.badge ? p.badge[lang] : `${t.saveAmount} ${saving} ${t.currency}`}
                </span>

                {discount && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E07A6B]/20 border border-[#E07A6B]/40 text-[#E07A6B] font-bold text-xs">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Product Image Area */}
              <div
                className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden cursor-pointer bg-[#18181b] mb-4"
                onClick={() => onOpenImage(p.images, 0)}
              >
                <FastImage
                  src={getThumbSrc(p.images[0])}
                  alt={p.name[lang]}
                  categoryKey={p.categoryKey}
                  accentColor={p.accentColor}
                  className="transition-transform duration-500 group-hover:scale-105"
                />

                {!p.available && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="px-4 py-1.5 rounded-full bg-[#E07A6B]/20 border border-[#E07A6B] text-[#E07A6B] font-bold text-xs tracking-wider uppercase">
                      {t.outOfStock}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#F5F2ED] mb-2 line-clamp-2 leading-snug">
                    {p.name[lang]}
                  </h3>

                  {p.description && (
                    <p className="text-xs sm:text-sm text-[#9E9E9E] mb-4 leading-relaxed line-clamp-3 bg-[#17171a] p-2.5 rounded-lg border border-[#26262a]">
                      {p.description[lang]}
                    </p>
                  )}
                </div>

                {/* Pricing & CTA */}
                <div>
                  <div className="flex items-baseline gap-2.5 mb-4">
                    <span className="text-xl sm:text-2xl font-black text-[#E5C378]">
                      {p.price.toLocaleString()} {t.currency}
                    </span>
                    {p.originalPrice && (
                      <span className="text-sm text-[#737373] line-through font-medium">
                        {p.originalPrice.toLocaleString()} {t.currency}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={!p.available}
                      onClick={() => p.available && onAddToCart(p)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#202024] hover:bg-[#2a2a30] text-[#F5F2ED] font-semibold text-xs sm:text-sm border border-[#333338] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                      <span>{t.addToCart}</span>
                    </button>

                    <button
                      type="button"
                      disabled={!p.available}
                      onClick={() => p.available && onQuickBuy(p)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C9A876] hover:brightness-110 text-[#0A0A0A] font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Zap className="w-4 h-4 fill-[#0A0A0A]" />
                      <span>{t.quickOrder}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
