import React from 'react';
import { Language } from '../types';
import { STR } from '../data/translations';
import { ShoppingBag, Globe, Sparkles, Flame } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onSelectCategory: (categoryKey: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  cartCount,
  onOpenCart,
  onSelectCategory,
}) => {
  const t = STR[lang];
  const isRTL = t.dir === 'rtl';

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0e]/90 backdrop-blur-md border-b border-[#202024]">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#D4AF37]/20 via-[#E5C378]/30 to-[#D4AF37]/20 border-b border-[#D4AF37]/30 py-1.5 px-4 text-center">
        <p className="text-[11px] sm:text-xs font-bold text-[#F5F2ED] tracking-wide flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
          <span>{t.topBar}</span>
        </p>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <BrandLogo size="md" className="group-hover:scale-105 transition-transform" />
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#F5F2ED] tracking-tight leading-none flex items-center gap-1.5">
              <span>{t.brand}</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#D4AF37] tracking-wider uppercase">
                {t.brandSub}
              </span>
            </div>
            <div className="text-[10px] text-[#8A8A8A] font-semibold tracking-wider mt-0.5 uppercase">
              {t.brandTagline}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <a
            href="#promotions"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('promotions');
              document.getElementById('promotions')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-[#E5C378] hover:text-[#D4AF37] transition-colors py-1 px-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30"
          >
            <Flame className="w-4 h-4 fill-[#E5C378]" />
            <span>{t.nav.promotions}</span>
          </a>
          <a href="#shop" className="text-[#A8A8A8] hover:text-[#F5F2ED] transition-colors">
            {t.nav.shop}
          </a>
          <a href="#reviews" className="text-[#A8A8A8] hover:text-[#F5F2ED] transition-colors">
            {t.nav.reviews}
          </a>
          <a href="#about" className="text-[#A8A8A8] hover:text-[#F5F2ED] transition-colors">
            {t.nav.about}
          </a>
        </nav>

        {/* Right Actions: Lang Switcher & Cart Button */}
        <div className="flex items-center gap-3">
          {/* Language Switch */}
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b1b1f] border border-[#2e2e36] text-xs font-bold text-[#F5F2ED] hover:bg-[#25252b] transition-colors cursor-pointer"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t.langSwitch}</span>
          </button>

          {/* Cart Icon button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C9A876] hover:brightness-110 text-[#0A0A0A] font-extrabold text-sm shadow-md transition-all cursor-pointer"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-4 h-4 fill-[#0A0A0A]" />
            <span>{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
