import React from 'react';
import { CartItem, Language } from '../types';
import { STR } from '../data/translations';
import { FastImage } from './FastImage';
import { getThumbSrc } from '../utils/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  lang: Language;
  onUpdateQty: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  lang,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const t = STR[lang];
  const isRTL = t.dir === 'rtl';

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex transition-opacity"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md h-full bg-[#111113] border-l border-[#26262a] shadow-2xl flex flex-col justify-between ${
          isRTL ? 'mr-auto' : 'ml-auto'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#222226] flex items-center justify-between bg-[#141416]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C378]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#F5F2ED]">{t.cartTitle}</h3>
              <p className="text-xs text-[#8A8A8A]">
                {cartItems.length} {t.cartItemsCount}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#202024] text-[#A8A8A8] hover:text-[#F5F2ED] hover:bg-[#2c2c33] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#737373]">
              <div className="w-16 h-16 rounded-full bg-[#1b1b1e] flex items-center justify-center mb-3 text-[#444]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-[#F5F2ED] text-base mb-1">{t.cartEmpty}</h4>
              <p className="text-xs max-w-xs">{t.cartEmptySub}</p>
            </div>
          ) : (
            cartItems.map((item) => {
              const colorInfo = item.selectedColor
                ? (item.colors || []).find((c) => c.hex === item.selectedColor)
                : null;

              return (
                <div
                  key={item.cartKey}
                  className="flex gap-3.5 p-3.5 rounded-xl bg-[#161619] border border-[#26262a] items-center justify-between"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#1c1c20] border border-[#2b2b30]">
                    <FastImage
                      src={getThumbSrc(item.images[0])}
                      alt={item.name[lang]}
                      categoryKey={item.categoryKey}
                      accentColor={item.accentColor}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-sm text-[#F5F2ED] truncate">{item.name[lang]}</h5>

                    {/* Color & Size badge */}
                    {(item.selectedColor || item.selectedSize) && (
                      <div className="flex items-center gap-2 text-xs text-[#9E9E9E] mt-1">
                        {item.selectedColor && (
                          <span className="flex items-center gap-1.5">
                            <span
                              className="w-3 h-3 rounded-full border border-white/20 inline-block"
                              style={{ background: item.selectedColor }}
                            />
                            <span>{colorInfo?.name[lang]}</span>
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="bg-[#242429] px-1.5 py-0.5 rounded text-[10px] text-[#D4AF37]">
                            {item.selectedSize}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-sm font-bold text-[#E5C378] mt-1">
                      {item.price.toLocaleString()} {t.currency}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.cartKey)}
                      className="text-[#666] hover:text-[#E07A6B] p-1 transition-colors cursor-pointer"
                      title={t.remove || 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center bg-[#202024] rounded-lg border border-[#2e2e34] p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.cartKey, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-[#A8A8A8] hover:text-white hover:bg-[#2d2d33] transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#F5F2ED]">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.cartKey, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-[#A8A8A8] hover:text-white hover:bg-[#2d2d33] transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-[#222226] bg-[#141416] space-y-3">
            <div className="flex items-center justify-between text-base font-bold">
              <span className="text-[#A8A8A8]">{t.total}</span>
              <span className="text-xl font-black text-[#E5C378]">
                {totalAmount.toLocaleString()} {t.currency}
              </span>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C9A876] hover:brightness-110 text-[#0A0A0A] font-extrabold text-base shadow-lg shadow-[#D4AF37]/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{t.checkout}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
