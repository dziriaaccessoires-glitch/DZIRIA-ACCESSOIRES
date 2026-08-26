import React, { useState, useMemo } from 'react';
import { Product, Language, CartItem } from './types';
import { PRODUCTS } from './data/products';
import { STR } from './data/translations';
import { Header } from './components/Header';
import { OptimizedBackground } from './components/OptimizedBackground';
import { PromotionsSection } from './components/PromotionsSection';
import { ProductCard } from './components/ProductCard';
import { TrustFeatures } from './components/TrustFeatures';
import { ReviewsSection, Footer } from './components/ReviewsSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { QuickOrderModal } from './components/QuickOrderModal';
import { Lightbox } from './components/Lightbox';
import { BrandLogo } from './components/BrandLogo';
import { Search, Flame, Sparkles, SlidersHorizontal, ShoppingBag, ArrowUp } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const t = STR[lang];
  const isRTL = t.dir === 'rtl';

  // Category & Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc' | 'discount'>('default');

  // Modals & Drawers
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickBuyProduct, setQuickBuyProduct] = useState<{
    product: Product;
    color?: string;
    size?: string;
  } | null>(null);

  // Lightbox
  const [lightboxData, setLightboxData] = useState<{
    images: string[];
    index: number;
  } | null>(null);

  // Categories list
  const categories = [
    { key: 'all', label: t.allCategories, icon: null },
    { key: 'promotions', label: t.catPromotions, icon: Flame, isPromo: true },
    { key: 'bracelets', label: t.catBracelets, icon: null },
    { key: 'necklaces', label: t.catNecklaces, icon: null },
    { key: 'watches', label: t.catWatches, icon: null },
    { key: 'sets', label: t.catSets, icon: null },
    { key: 'rings', label: t.catRings, icon: null },
  ];

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter by Category
    if (selectedCategory === 'promotions') {
      result = result.filter((p) => p.isPromo || p.categoryKey === 'promotions');
    } else if (selectedCategory !== 'all') {
      result = result.filter((p) => p.categoryKey === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name[lang].toLowerCase().includes(q) ||
          p.category[lang].toLowerCase().includes(q) ||
          (p.description && p.description[lang].toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => {
        const discA = a.originalPrice ? a.originalPrice - a.price : 0;
        const discB = b.originalPrice ? b.originalPrice - b.price : 0;
        return discB - discA;
      });
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy, lang]);

  // Cart operations
  const handleAddToCart = (product: Product, selectedColor?: string, selectedSize?: string) => {
    const cartKey = `${product.id}__${selectedColor || ''}__${selectedSize || ''}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          cartKey,
          qty: 1,
          selectedColor,
          selectedSize,
        },
      ];
    });
  };

  const handleUpdateQty = (cartKey: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemoveCartItem = (cartKey: string) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const handleQuickBuy = (product: Product, selectedColor?: string, selectedSize?: string) => {
    setQuickBuyProduct({ product, color: selectedColor, size: selectedSize });
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div
      dir={t.dir}
      className={`min-h-screen bg-[#09090b] text-[#F5F2ED] selection:bg-[#D4AF37]/30 selection:text-[#F5F2ED] relative ${
        isRTL ? 'font-arabic' : 'font-sans'
      }`}
    >
      {/* Ultra-lightweight Background Glow */}
      <OptimizedBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Header
          lang={lang}
          onToggleLang={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 text-center">
          {/* Official Brand Logo Emblem */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative">
              <BrandLogo size="hero" withGlow={true} className="hover:scale-105 transition-transform duration-300" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18181c] border border-[#2b2b32] text-[#D4AF37] text-xs font-bold tracking-wide mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.heroEyebrow}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#F5F2ED] tracking-tight leading-[1.15] max-w-3xl mx-auto mb-4">
            {t.heroTitle1}{' '}
            <span className="bg-gradient-to-r from-[#F5D8A0] via-[#D4AF37] to-[#C9A876] bg-clip-text text-transparent">
              {t.heroTitle2}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#A8A8A8] max-w-xl mx-auto mb-8 leading-relaxed">
            {t.heroBody}
          </p>

          <div className="flex items-center justify-center gap-3.5 flex-wrap">
            <a
              href="#shop"
              className="px-6 py-3.5 rounded-full bg-[#F5F2ED] hover:bg-white text-[#0A0A0A] font-extrabold text-sm shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              {t.heroCta}
            </a>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('promotions');
                document.getElementById('promotions')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38F2D] hover:brightness-110 text-[#0A0A0A] font-black text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-[#0A0A0A]" />
              <span>{t.heroPromoCta}</span>
            </button>
          </div>
        </section>

        {/* Dedicated Promotions Section */}
        <PromotionsSection
          products={PRODUCTS}
          lang={lang}
          onAddToCart={(p) => handleAddToCart(p)}
          onQuickBuy={(p) => handleQuickBuy(p)}
          onOpenImage={(imgs, idx) => setLightboxData({ images: imgs, index: idx })}
        />

        {/* Trust Badges */}
        <TrustFeatures lang={lang} />

        {/* Main Shop Catalog Area */}
        <main id="shop" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#F5F2ED] mb-2">{t.sectionShop}</h2>
            <p className="text-sm text-[#8A8A8A]">{t.sectionShopSub}</p>
          </div>

          {/* Search & Sort Bar */}
          <div className="flex flex-col md:flex-row items-center gap-3.5 mb-8">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search
                className={`w-4 h-4 text-[#737373] absolute top-1/2 -translate-y-1/2 ${
                  isRTL ? 'right-4' : 'left-4'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full bg-[#141417] border border-[#26262c] focus:border-[#D4AF37] text-[#F5F2ED] text-sm rounded-2xl py-3 outline-none transition-colors ${
                  isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`text-xs text-[#8A8A8A] hover:text-white absolute top-1/2 -translate-y-1/2 ${
                    isRTL ? 'left-3.5' : 'right-3.5'
                  }`}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto">
              <div className="relative w-full md:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-[#141417] border border-[#26262c] focus:border-[#D4AF37] text-[#F5F2ED] text-xs font-semibold rounded-2xl py-3 px-3.5 outline-none cursor-pointer"
                >
                  <option value="default">{t.sortDefault}</option>
                  <option value="priceAsc">{t.sortPriceAsc}</option>
                  <option value="priceDesc">{t.sortPriceDesc}</option>
                  <option value="discount">{t.sortDiscount}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills (with Promotions highlight) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              const Icon = cat.icon;

              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? cat.isPromo
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F2D] text-[#0A0A0A] shadow-md shadow-[#D4AF37]/20 scale-105'
                        : 'bg-[#F5F2ED] text-[#0A0A0A] shadow-md'
                      : cat.isPromo
                      ? 'bg-[#D4AF37]/10 text-[#E5C378] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/20'
                      : 'bg-[#141417] text-[#A8A8A8] border border-[#24242a] hover:text-[#F5F2ED] hover:border-[#383842]'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 fill-current" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#131316] rounded-3xl border border-[#232328] p-8">
              <p className="text-lg font-bold text-[#F5F2ED] mb-1">{t.noResults}</p>
              <p className="text-xs text-[#8A8A8A] mb-4">{t.noResultsSub}</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2 rounded-xl bg-[#202025] hover:bg-[#2a2a32] text-xs font-semibold text-[#D4AF37] transition-colors cursor-pointer"
              >
                {t.allCategories}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  lang={lang}
                  onAddToCart={(prod, col, sz) => handleAddToCart(prod, col, sz)}
                  onQuickBuy={(prod, col, sz) => handleQuickBuy(prod, col, sz)}
                  onOpenLightbox={(imgs, idx) => setLightboxData({ images: imgs, index: idx })}
                />
              ))}
            </div>
          )}
        </main>

        {/* Customer Reviews */}
        <ReviewsSection lang={lang} />

        {/* Footer */}
        <Footer lang={lang} />

        {/* Mobile Sticky Floating Cart Bar */}
        {totalCartCount > 0 && (
          <div className="fixed bottom-3 inset-x-3 md:hidden z-40">
            <div className="bg-[#151518]/95 backdrop-blur-md border border-[#D4AF37]/50 rounded-2xl p-3 shadow-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5" onClick={() => setIsCartOpen(true)}>
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5 fill-black" />
                </div>
                <div>
                  <div className="text-xs text-[#A8A8A8]">
                    {totalCartCount} {t.cartItemsCount}
                  </div>
                  <div className="text-sm font-black text-[#E5C378]">
                    {totalCartPrice.toLocaleString()} {t.currency}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C9A876] text-[#0A0A0A] font-extrabold text-xs shadow-md"
              >
                {t.checkout}
              </button>
            </div>
          </div>
        )}

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          lang={lang}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveCartItem}
          onProceedToCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cart}
          lang={lang}
          onSuccessReset={() => {
            setCart([]);
          }}
        />

        {/* Quick Order 1-Click Modal */}
        <QuickOrderModal
          product={quickBuyProduct?.product || null}
          selectedColor={quickBuyProduct?.color}
          selectedSize={quickBuyProduct?.size}
          isOpen={Boolean(quickBuyProduct)}
          onClose={() => setQuickBuyProduct(null)}
          lang={lang}
        />

        {/* Image Fullscreen Lightbox */}
        {lightboxData && (
          <Lightbox
            images={lightboxData.images}
            index={lightboxData.index}
            onClose={() => setLightboxData(null)}
            onPrev={() =>
              setLightboxData((prev) =>
                prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null
              )
            }
            onNext={() =>
              setLightboxData((prev) =>
                prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null
              )
            }
          />
        )}
      </div>
    </div>
  );
}
