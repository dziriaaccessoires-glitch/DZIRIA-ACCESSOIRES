import React, { useState } from 'react';
import { CartItem, Language, OrderFormData, Wilaya } from '../types';
import { STR } from '../data/translations';
import { WILAYAS, getWilayaConfig } from '../data/wilayas';
import { X, CheckCircle, Phone, Send, MapPin, Truck, AlertCircle, ShoppingBag } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  lang: Language;
  onSuccessReset: () => void;
}

const WHATSAPP_NUMBER = "213792090250";
const ORDERS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbxkS1qxThYh-iaOjDj9hyt0q3FN6vncSAiRwgehdKb5qb25zYFxW46oC5HbB0EqjI_6WQ/exec";

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  lang,
  onSuccessReset,
}) => {
  const t = STR[lang];
  const isRTL = t.dir === 'rtl';

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

  if (!isOpen) return null;

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const selectedWilaya = getWilayaConfig(form.wilaya);
  const selectedCommune =
    selectedWilaya?.communes?.find((c) => c.ar === form.commune || c.fr === form.commune) || null;
  const hasOffice = Boolean(selectedCommune);
  const deliveryFee = selectedWilaya ? selectedWilaya[form.deliveryType] : 0;
  const grandTotal = cartTotal + deliveryFee;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = lang === 'ar' ? 'يرجى كتابة الاسم' : 'Nom requis';
    if (!form.phone.trim() || form.phone.trim().length < 9)
      errs.phone = lang === 'ar' ? 'رقم هاتف غير صالح' : 'Numéro de téléphone invalide';
    if (!form.wilaya) errs.wilaya = lang === 'ar' ? 'يرجى اختيار الولاية' : 'Wilaya requise';
    if (!form.commune.trim()) errs.commune = lang === 'ar' ? 'يرجى كتابة البلدية' : 'Commune requise';
    if (form.deliveryType === 'home' && !form.address.trim())
      errs.address = lang === 'ar' ? 'يرجى كتابة العنوان الكامل' : 'Adresse requise';
    if (form.deliveryType === 'office' && !hasOffice)
      errs.delivery = t.noOffice;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildOrderMessage = (): string => {
    const lines: string[] = [];
    lines.push(lang === 'ar' ? '✨ طلب جديد من متجر ديزيريا للأكسسوارات 🛍️' : '✨ Nouvelle commande Dziria Accessoires 🛍️');
    lines.push('-----------------------------');
    cartItems.forEach((item) => {
      const colorInfo = item.selectedColor
        ? (item.colors || []).find((c) => c.hex === item.selectedColor)
        : null;
      const variantBits: string[] = [];
      if (colorInfo) variantBits.push(`${t.colorLabel}: ${colorInfo.name[lang]}`);
      if (item.selectedSize) variantBits.push(`${t.sizeLabel}: ${item.selectedSize}`);
      const variantStr = variantBits.length ? ` (${variantBits.join(' / ')})` : '';

      lines.push(`• ${item.name[lang]}${variantStr} x${item.qty} = ${(item.price * item.qty).toLocaleString()} ${t.currency}`);
    });
    lines.push('-----------------------------');
    lines.push(`${t.subtotal}: ${cartTotal.toLocaleString()} ${t.currency}`);
    lines.push(`${t.deliveryFee}: +${deliveryFee.toLocaleString()} ${t.currency} (${form.deliveryType === 'home' ? t.deliveryHome : t.deliveryOffice})`);
    lines.push(`💰 ${t.total}: ${grandTotal.toLocaleString()} ${t.currency}`);
    lines.push('-----------------------------');
    lines.push(`👤 ${t.name}: ${form.name}`);
    lines.push(`📞 ${t.phone}: ${form.phone}`);
    lines.push(`📍 ${t.wilaya}: ${selectedWilaya ? selectedWilaya[lang] : form.wilaya}`);
    lines.push(`🏙️ ${t.commune}: ${form.commune}`);
    if (form.deliveryType === 'home') lines.push(`🏠 ${t.fullAddress}: ${form.address}`);
    if (form.deliveryType === 'office' && selectedCommune) lines.push(`🏢 ${t.officeAddress}: ${selectedCommune[lang]}`);
    if (form.notes.trim()) lines.push(`📝 ${t.notes}: ${form.notes}`);
    lines.push('-----------------------------');
    lines.push(lang === 'ar' ? 'يرجى تأكيد الطلب والشحن، شكراً لكم!' : 'Merci de confirmer l’envoi svp !');
    return lines.join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const orderPayload = {
        date: new Date().toLocaleString('fr-FR'),
        name: form.name,
        phone: form.phone,
        wilaya: selectedWilaya ? selectedWilaya[lang] : form.wilaya,
        commune: form.commune,
        address: form.address,
        notes: form.notes,
        deliveryType: form.deliveryType,
        deliveryFee,
        subtotal: cartTotal,
        total: grandTotal,
        items: cartItems
          .map((i) => `${i.name[lang]} x${i.qty} (${i.price * i.qty} ${t.currency})`)
          .join(' | '),
      };

      fetch(ORDERS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(orderPayload),
      }).catch(() => {});
    } catch {
      // Ignore network errors on optional sheet hook
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const sendToWhatsapp = () => {
    const msg = buildOrderMessage();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const sendToInstagram = () => {
    const msg = buildOrderMessage();
    window.open(`https://ig.me/m/dziria_accessoires?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#141416] border border-[#2c2c32] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#242428] mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#F5F2ED]">
                  {t.checkoutTitle}
                </h3>
                <p className="text-xs text-[#8A8A8A] mt-1">{t.checkoutSub}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#202024] text-[#A8A8A8] hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#A8A8A8] mb-1.5">{t.name} *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={lang === 'ar' ? 'مثال: سارة بن علي' : 'Ex: Sarah Benali'}
                  className="w-full bg-[#1b1b1f] border border-[#2b2b32] focus:border-[#D4AF37] text-[#F5F2ED] rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
                />
                {errors.name && <p className="text-xs text-[#E07A6B] mt-1">{errors.name}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-[#A8A8A8] mb-1.5">{t.phone} *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="06 / 07 / 05..."
                  className="w-full bg-[#1b1b1f] border border-[#2b2b32] focus:border-[#D4AF37] text-[#F5F2ED] rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
                />
                {errors.phone && <p className="text-xs text-[#E07A6B] mt-1">{errors.phone}</p>}
              </div>

              {/* Wilaya Selection */}
              <div>
                <label className="block text-xs font-bold text-[#A8A8A8] mb-1.5">{t.wilaya} *</label>
                <select
                  value={form.wilaya}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm({ ...form, wilaya: val, commune: '', address: '' });
                    setErrors((prev) => ({ ...prev, wilaya: '', commune: '', address: '' }));
                  }}
                  className="w-full bg-[#1b1b1f] border border-[#2b2b32] focus:border-[#D4AF37] text-[#F5F2ED] rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors cursor-pointer"
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

              {/* Commune Selection */}
              <div>
                <label className="block text-xs font-bold text-[#A8A8A8] mb-1.5">{t.commune} *</label>
                {selectedWilaya?.communes && selectedWilaya.communes.length > 0 ? (
                  <select
                    value={form.commune}
                    onChange={(e) => {
                      const val = e.target.value;
                      const hasOffice = Boolean(
                        selectedWilaya.communes.some((c) => c.ar === val || c.fr === val)
                      );
                      setForm({
                        ...form,
                        commune: val,
                        deliveryType: hasOffice ? form.deliveryType : 'home',
                      });
                      setErrors((prev) => ({ ...prev, commune: '' }));
                    }}
                    className="w-full bg-[#1b1b1f] border border-[#2b2b32] focus:border-[#D4AF37] text-[#F5F2ED] rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors cursor-pointer"
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
                    className="w-full bg-[#1b1b1f] border border-[#2b2b32] focus:border-[#D4AF37] text-[#F5F2ED] rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
                  />
                )}
                {errors.commune && <p className="text-xs text-[#E07A6B] mt-1">{errors.commune}</p>}
              </div>

              {/* Delivery Type Option - Home vs Office */}
              <div>
                <label className="block text-xs font-bold text-[#A8A8A8] mb-2 flex items-center justify-between">
                  <span>{t.deliveryLabel} *</span>
                  <span className="text-[11px] text-[#D4AF37] font-semibold">
                    {form.deliveryType === 'home' ? t.deliveryHome : t.deliveryOffice}
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Home Delivery Card */}
                  <div
                    onClick={() => setForm({ ...form, deliveryType: 'home' })}
                    className={`relative flex flex-col justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      form.deliveryType === 'home'
                        ? 'bg-gradient-to-b from-[#1f1e1a] to-[#161619] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10 scale-[1.02]'
                        : 'bg-[#151518] border-[#292930] hover:border-[#3d3d46] opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={form.deliveryType === 'home'}
                        onChange={() => setForm({ ...form, deliveryType: 'home' })}
                        className="accent-[#D4AF37] w-4 h-4 mt-0.5"
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-[#F5F2ED] leading-tight">
                          {t.deliveryHome}
                        </div>
                        <div className="text-[10px] text-[#8A8A8A] mt-0.5">
                          {lang === 'ar' ? 'حتى باب منزلك' : 'Directement chez vous'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#292930] flex items-center justify-between">
                      <span className="text-[10px] text-[#737373]">{lang === 'ar' ? 'السعر:' : 'Tarif:'}</span>
                      <span className="text-xs sm:text-sm font-black text-[#E5C378]">
                        {selectedWilaya ? `+${selectedWilaya.home.toLocaleString()} ${t.currency}` : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Stop Desk Office Delivery Card */}
                  <div
                    onClick={() => {
                      if (hasOffice || !selectedWilaya) {
                        setForm({ ...form, deliveryType: 'office' });
                      }
                    }}
                    className={`relative flex flex-col justify-between p-3.5 rounded-2xl border-2 transition-all duration-200 ${
                      !hasOffice && selectedWilaya
                        ? 'opacity-40 cursor-not-allowed bg-[#141416] border-[#222226]'
                        : form.deliveryType === 'office'
                        ? 'bg-gradient-to-b from-[#1f1e1a] to-[#161619] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10 scale-[1.02] cursor-pointer'
                        : 'bg-[#151518] border-[#292930] hover:border-[#3d3d46] opacity-80 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="deliveryType"
                        disabled={!hasOffice && Boolean(selectedWilaya)}
                        checked={form.deliveryType === 'office'}
                        onChange={() => hasOffice && setForm({ ...form, deliveryType: 'office' })}
                        className="accent-[#D4AF37] w-4 h-4 mt-0.5"
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-[#F5F2ED] leading-tight">
                          {t.deliveryOffice}
                        </div>
                        <div className="text-[10px] text-[#8A8A8A] mt-0.5">
                          {lang === 'ar' ? 'استلام من مكتب ياليدين' : 'Bureau Yalidine'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#292930] flex items-center justify-between">
                      <span className="text-[10px] text-[#737373]">{lang === 'ar' ? 'السعر:' : 'Tarif:'}</span>
                      <span className="text-xs sm:text-sm font-black text-[#E5C378]">
                        {selectedWilaya
                          ? hasOffice
                            ? `+${selectedWilaya.office.toLocaleString()} ${t.currency}`
                            : lang === 'ar'
                            ? 'غير متوفر'
                            : 'Indisponible'
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Office address helper banner */}
                {form.deliveryType === 'office' && hasOffice && selectedCommune && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-[#1c1c20] border border-[#2e2e36] text-xs text-[#A8A8A8] flex items-center gap-2">
                    <span className="text-[#D4AF37]">🏢</span>
                    <span>
                      {t.officeAddress}: <strong className="text-[#F5F2ED]">{selectedCommune[lang]}</strong>
                    </span>
                  </div>
                )}
                {errors.delivery && <p className="text-xs text-[#E07A6B] mt-1.5">{errors.delivery}</p>}
              </div>

              {/* Home Address input */}
              {form.deliveryType === 'home' && (
                <div>
                  <label className="block text-xs font-bold text-[#A8A8A8] mb-1.5">
                    {t.fullAddress} *
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder={lang === 'ar' ? 'الحي، الشارع، رقم العمارة أو المنزل' : 'Quartier, rue, N°'}
                    className="w-full bg-[#1b1b1f] border border-[#2b2b32] focus:border-[#D4AF37] text-[#F5F2ED] rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
                  />
                  {errors.address && <p className="text-xs text-[#E07A6B] mt-1">{errors.address}</p>}
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#A8A8A8] mb-1.5">{t.notes}</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder={lang === 'ar' ? 'أي ملاحظة إضافية تودين إخبارنا بها...' : 'Remarque éventuelle...'}
                  className="w-full bg-[#1b1b1f] border border-[#2b2b32] focus:border-[#D4AF37] text-[#F5F2ED] rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors resize-none"
                />
              </div>

              {/* Summary calculation Box */}
              <div className="bg-[#19191d] rounded-2xl p-4 border border-[#2a2a30] space-y-2 mt-4">
                <div className="flex justify-between text-xs text-[#8A8A8A]">
                  <span>{t.subtotal}</span>
                  <span>{cartTotal.toLocaleString()} {t.currency}</span>
                </div>
                <div className="flex justify-between text-xs text-[#8A8A8A]">
                  <span>{t.deliveryFee}</span>
                  <span>
                    {selectedWilaya ? `+${deliveryFee.toLocaleString()} ${t.currency}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#F5F2ED] pt-2 border-t border-[#292930]">
                  <span>{t.total}</span>
                  <span className="text-[#E5C378] text-lg font-black">
                    {grandTotal.toLocaleString()} {t.currency}
                  </span>
                </div>
              </div>

              {/* Security / Serious note */}
              <p className="text-[11px] text-[#A8A8A8] text-center">{t.seriousOnly}</p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C9A876] hover:brightness-110 text-[#0A0A0A] font-extrabold text-base shadow-lg shadow-[#D4AF37]/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{t.sendingOrder}</span>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 fill-[#0A0A0A]" />
                    <span>{t.submitOrder}</span>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Confirmation Success Screen */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto mb-4 text-[#E5C378] animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-[#F5F2ED] mb-2">{t.orderSuccess}</h3>
            <p className="text-sm text-[#A8A8A8] leading-relaxed max-w-sm mx-auto mb-6">
              {t.orderSuccessSub}
            </p>

            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={sendToWhatsapp}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-[#0A0A0A] font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Phone className="w-5 h-5 fill-[#0A0A0A]" />
                <span>{t.sendViaWhatsapp}</span>
              </button>

              <button
                type="button"
                onClick={sendToInstagram}
                className="w-full py-3 px-4 rounded-xl bg-[#1f1f24] hover:bg-[#27272e] text-[#F5F2ED] font-bold text-sm border border-[#33333b] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#E5C378]" />
                <span>{t.sendViaInstagram}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onSuccessReset();
                onClose();
              }}
              className="text-xs text-[#8A8A8A] hover:text-[#F5F2ED] transition-colors cursor-pointer"
            >
              {t.backToShop}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
