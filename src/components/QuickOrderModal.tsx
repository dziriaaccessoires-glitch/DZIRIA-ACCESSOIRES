import React, { useState } from 'react';
import { Product, Language, OrderFormData } from '../types';
import { STR } from '../data/translations';
import { WILAYAS, getWilayaConfig } from '../data/wilayas';
import { FastImage } from './FastImage';
import { X, Zap, Phone, CheckCircle, ShoppingBag } from 'lucide-react';

interface QuickOrderModalProps {
  product: Product | null;
  selectedColor?: string;
  selectedSize?: string;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const WHATSAPP_NUMBER = "213792090250";
const ORDERS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbxkS1qxThYh-iaOjDj9hyt0q3FN6vncSAiRwgehdKb5qb25zYFxW46oC5HbB0EqjI_6WQ/exec";

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  product,
  selectedColor: initialColor,
  selectedSize: initialSize,
  isOpen,
  onClose,
  lang,
}) => {
  const t = STR[lang];

  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(initialColor);
  const [size, setSize] = useState(initialSize);

  const [form, setForm] = useState<OrderFormData>({
    name: '',
    phone: '',
    wilaya: '',
    commune: '',
    address: '',
    notes: '',
    deliveryType: 'home',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync state when product changes
  React.useEffect(() => {
    if (product) {
      setColor(
        initialColor ||
          (product.colors && product.colors.length > 0
            ? product.colors.find((c) => c.available !== false)?.hex
            : undefined)
      );
      setSize(initialSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined));
      setQty(1);
      setIsSubmitted(false);
      setErrors({});
    }
  }, [product, initialColor, initialSize]);

  if (!isOpen || !product) return null;

  const productTotal = product.price * qty;
  const selectedWilaya = getWilayaConfig(form.wilaya);
  const selectedCommune =
    selectedWilaya?.communes?.find((c) => c.ar === form.commune || c.fr === form.commune) || null;
  const hasOffice = Boolean(selectedCommune);
  const deliveryFee = selectedWilaya ? selectedWilaya[form.deliveryType] : 0;
  const grandTotal = productTotal + deliveryFee;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = lang === 'ar' ? 'الاسم مطلوب' : 'Nom requis';
    if (!form.phone.trim() || form.phone.trim().length < 9)
      errs.phone = lang === 'ar' ? 'رقم الهاتف غير صحيح' : 'Téléphone invalide';
    if (!form.wilaya) errs.wilaya = lang === 'ar' ? 'اختر الولاية' : 'Wilaya requise';
    if (!form.commune.trim()) errs.commune = lang === 'ar' ? 'اختر البلدية' : 'Commune requise';
    if (form.deliveryType === 'home' && !form.address.trim())
      errs.address = lang === 'ar' ? 'العنوان مطلوب' : 'Adresse requise';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildMessage = (): string => {
    const lines: string[] = [];
    lines.push(lang === 'ar' ? '⚡ طلب سريع من المتجر' : '⚡ Commande Rapide Dziria');
    lines.push(`• ${product.name[lang]} x${qty}`);
    if (color) {
      const cInfo = (product.colors || []).find((c) => c.hex === color);
      lines.push(`- ${t.colorLabel}: ${cInfo ? cInfo.name[lang] : color}`);
    }
    if (size) lines.push(`- ${t.sizeLabel}: ${size}`);
    lines.push(`${t.subtotal}: ${productTotal.toLocaleString()} ${t.currency}`);
    lines.push(`${t.deliveryFee}: +${deliveryFee.toLocaleString()} ${t.currency}`);
    lines.push(`💰 ${t.total}: ${grandTotal.toLocaleString()} ${t.currency}`);
    lines.push(`👤 ${t.name}: ${form.name}`);
    lines.push(`📞 ${t.phone}: ${form.phone}`);
    lines.push(`📍 ${t.wilaya}: ${selectedWilaya ? selectedWilaya[lang] : form.wilaya} - ${form.commune}`);
    if (form.deliveryType === 'home') lines.push(`🏠 ${t.fullAddress}: ${form.address}`);
    return lines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      fetch(ORDERS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          date: new Date().toLocaleString('fr-FR'),
          name: form.name,
          phone: form.phone,
          wilaya: selectedWilaya ? selectedWilaya[lang] : form.wilaya,
          commune: form.commune,
          address: form.address,
          deliveryType: form.deliveryType,
          total: grandTotal,
          items: `${product.name[lang]} x${qty}`,
        }),
      }).catch(() => {});
    } catch {}

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#141416] border border-[#303038] rounded-3xl p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#242428] mb-4">
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Zap className="w-5 h-5 fill-[#D4AF37]" />
            <h3 className="text-lg font-black text-[#F5F2ED]">{t.quickOrder}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#202024] text-[#A8A8A8] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isSubmitted ? (
          <>
            {/* Selected Product Summary Card */}
            <div className="flex gap-3.5 p-3 rounded-2xl bg-[#1a1a1e] border border-[#2d2d34] items-center mb-5">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#24242a]">
                <FastImage
                  src={product.images[0]}
                  alt={product.name[lang]}
                  categoryKey={product.categoryKey}
                  accentColor={product.accentColor}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-[#F5F2ED] truncate">{product.name[lang]}</h4>
                <div className="text-sm font-extrabold text-[#E5C378]">
                  {product.price.toLocaleString()} {t.currency}
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#A8A8A8] mb-1">{t.name} *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={lang === 'ar' ? 'الاسم واللقب' : 'Nom & prénom'}
                  className="w-full bg-[#1b1b1f] border border-[#2b2b32] focus:border-[#D4AF37] text-[#F5F2ED] rounded-xl px-3.5 py-2 text-sm outline-none"
                />
                {errors.name && <p className="text-xs text-[#E07A6B] mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8A8A8] mb-1">{t.phone} *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="06 / 07 / 05..."
                  className="w-full bg-[#1b1b1f] border border-[#2b2b32] focus:border-[#D4AF37] text-[#F5F2ED] rounded-xl px-3.5 py-2 text-sm outline-none"
                />
                {errors.phone && <p className="text-xs text-[#E07A6B] mt-1">{errors.phone}</p>}
              </div>

              {/* Wilaya & Commune row */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#A8A8A8] mb-1">{t.wilaya} *</label>
                  <select
                    value={form.wilaya}
                    onChange={(e) => {
                      setForm({ ...form, wilaya: e.target.value, commune: '' });
                      setErrors((prev) => ({ ...prev, wilaya: '', commune: '' }));
                    }}
                    className="w-full bg-[#1b1b1f] border border-[#2b2b32] focus:border-[#D4AF37] text-[#F5F2ED] rounded-xl px-2.5 py-2 text-xs outline-none cursor-pointer"
                  >
                    <option value="">{t.chooseWilaya}</option>
                    {WILAYAS.map((w) => (
                      <option key={w.key} value={w.key}>
                        {w.code} - {w[lang]}
                      </option>
                    ))}
                  </select>
                  {errors.wilaya && <p className="text-xs text-[#E07A6B] mt-1">{errors.wilaya}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8A8A8] mb-1">{t.commune} *</label>
                  {selectedWilaya?.communes && selectedWilaya.communes.length > 0 ? (
                    <select
                      value={form.commune}
                      onChange={(e) => setForm({ ...form, commune: e.target.value })}
                      className="w-full bg-[#1b1b1f] border border-[#2b2b32] focus:border-[#D4AF37] text-[#F5F2ED] rounded-xl px-2.5 py-2 text-xs outline-none cursor-pointer"
                    >
                      <option value="">{t.chooseCommune}</option>
                      {selectedWilaya.communes.map((c) => (
                        <option key={c.fr} value={c.fr}>
                          {c[lang]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={form.commune}
                      onChange={(e) => setForm({ ...form, commune: e.target.value })}
                      placeholder={t.chooseCommune}
                      className="w-full bg-[#1b1b1f] border border-[#2b2b32] focus:border-[#D4AF37] text-[#F5F2ED] rounded-xl px-2.5 py-2 text-xs outline-none"
                    />
                  )}
                  {errors.commune && <p className="text-xs text-[#E07A6B] mt-1">{errors.commune}</p>}
                </div>
              </div>

              {/* Delivery Type Option - Home vs Office */}
              <div>
                <label className="block text-xs font-bold text-[#A8A8A8] mb-1.5">{t.deliveryLabel} *</label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Home */}
                  <div
                    onClick={() => setForm({ ...form, deliveryType: 'home' })}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      form.deliveryType === 'home'
                        ? 'bg-[#1e1e23] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                        : 'bg-[#17171a] border-[#2b2b30] opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5F2ED]">
                      <input
                        type="radio"
                        name="quickDeliveryType"
                        checked={form.deliveryType === 'home'}
                        onChange={() => setForm({ ...form, deliveryType: 'home' })}
                        className="accent-[#D4AF37]"
                      />
                      <span>{t.deliveryHome}</span>
                    </div>
                    <div className="text-xs font-extrabold text-[#E5C378] mt-1 text-end">
                      {selectedWilaya ? `+${selectedWilaya.home} ${t.currency}` : '—'}
                    </div>
                  </div>

                  {/* Office */}
                  <div
                    onClick={() => {
                      if (hasOffice || !selectedWilaya) {
                        setForm({ ...form, deliveryType: 'office' });
                      }
                    }}
                    className={`p-2.5 rounded-xl border transition-all ${
                      !hasOffice && selectedWilaya
                        ? 'opacity-40 cursor-not-allowed bg-[#141416] border-[#222226]'
                        : form.deliveryType === 'office'
                        ? 'bg-[#1e1e23] border-[#D4AF37] ring-1 ring-[#D4AF37] cursor-pointer'
                        : 'bg-[#17171a] border-[#2b2b30] opacity-80 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5F2ED]">
                      <input
                        type="radio"
                        name="quickDeliveryType"
                        disabled={!hasOffice && Boolean(selectedWilaya)}
                        checked={form.deliveryType === 'office'}
                        onChange={() => hasOffice && setForm({ ...form, deliveryType: 'office' })}
                        className="accent-[#D4AF37]"
                      />
                      <span>{t.deliveryOffice}</span>
                    </div>
                    <div className="text-xs font-extrabold text-[#E5C378] mt-1 text-end">
                      {selectedWilaya
                        ? hasOffice
                          ? `+${selectedWilaya.office} ${t.currency}`
                          : lang === 'ar'
                          ? 'غير متاح'
                          : 'Indisponible'
                        : '—'}
                    </div>
                  </div>
                </div>

                {form.deliveryType === 'office' && hasOffice && selectedCommune && (
                  <div className="mt-2 p-2 rounded-lg bg-[#1a1a1e] border border-[#2d2d34] text-[11px] text-[#A8A8A8]">
                    🏢 {t.officeAddress}: <strong className="text-white">{selectedCommune[lang]}</strong>
                  </div>
                )}
              </div>

              {form.deliveryType === 'home' && (
                <div>
                  <label className="block text-xs font-bold text-[#A8A8A8] mb-1">{t.fullAddress} *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder={lang === 'ar' ? 'العنوان / الحي / رقم المنزل' : 'Adresse complète'}
                    className="w-full bg-[#1b1b1f] border border-[#2b2b32] focus:border-[#D4AF37] text-[#F5F2ED] rounded-xl px-3.5 py-2 text-sm outline-none"
                  />
                  {errors.address && <p className="text-xs text-[#E07A6B] mt-1">{errors.address}</p>}
                </div>
              )}

              {/* Price calculation */}
              <div className="bg-[#18181c] p-3 rounded-xl border border-[#2a2a30] text-xs flex justify-between items-center font-bold">
                <span className="text-[#8A8A8A]">{t.total} (مع التوصيل):</span>
                <span className="text-[#E5C378] text-base font-black">
                  {grandTotal.toLocaleString()} {t.currency}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C9A876] hover:brightness-110 text-[#0A0A0A] font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 fill-[#0A0A0A]" />
                <span>{t.submitOrder}</span>
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-[#E5C378] mx-auto mb-3" />
            <h4 className="text-xl font-bold text-[#F5F2ED] mb-2">{t.orderSuccess}</h4>
            <p className="text-xs text-[#A8A8A8] mb-4">{t.orderSuccessSub}</p>

            <button
              type="button"
              onClick={() => {
                const msg = buildMessage();
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] text-[#0A0A0A] font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 fill-[#0A0A0A]" />
              <span>{t.sendViaWhatsapp}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
