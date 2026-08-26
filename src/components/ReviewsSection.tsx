import React from 'react';
import { Language } from '../types';
import { STR, REVIEWS } from '../data/translations';
import { Star, CheckCircle, MapPin, Instagram, Phone, Truck, ShieldCheck, Banknote } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface ReviewsSectionProps {
  lang: Language;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ lang }) => {
  const t = STR[lang];

  return (
    <section id="reviews" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h3 className="text-2xl sm:text-3xl font-black text-[#F5F2ED]">{t.reviewsTitle}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((r) => (
          <div
            key={r.id}
            className="p-5 sm:p-6 rounded-2xl bg-[#131316] border border-[#232328] flex flex-col justify-between"
          >
            <div>
              {/* Stars */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#E5C378] text-[#E5C378]" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-sm text-[#E6E6E6] leading-relaxed mb-4">
                "{r.comment[lang]}"
              </p>
            </div>

            {/* Author info */}
            <div className="flex items-center justify-between pt-3 border-t border-[#222226] text-xs text-[#8A8A8A]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#F5F2ED]">{r.name}</span>
                <span className="flex items-center gap-1 text-[#D4AF37]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'مشتري موثق' : 'Achat vérifié'}</span>
                </span>
              </div>
              <span>{r.city}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const Footer: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = STR[lang];

  return (
    <footer id="contact" className="bg-[#0b0b0d] border-t border-[#1e1e23] pt-12 pb-24 md:pb-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-center md:text-start">
          {/* Brand Col */}
          <div className="flex flex-col items-center md:items-start">
            <BrandLogo size="lg" showText={true} className="mb-3" />
            <p className="text-xs text-[#8A8A8A] leading-relaxed max-w-sm mx-auto md:mx-0">
              {t.aboutBody}
            </p>
          </div>

          {/* Trust note */}
          <div>
            <h5 className="text-sm font-bold text-[#D4AF37] mb-3">{lang === 'ar' ? 'التوصيل والضمان' : 'Livraison & Garantie'}</h5>
            <div className="space-y-2.5 text-xs text-[#A8A8A8] text-start">
              <div className="flex items-center gap-2.5 bg-[#141418] p-2.5 rounded-lg border border-[#222228]">
                <Truck className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span className="font-semibold text-[#F5F2ED]">
                  {lang === 'ar' ? 'توصيل سريع متوفر لـ 58 ولاية' : 'Livraison rapide disponible pour 58 wilayas'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#141418] p-2.5 rounded-lg border border-[#222228]">
                <Banknote className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                <span className="font-semibold text-[#F5F2ED]">
                  {lang === 'ar' ? 'الدفع عند الاستلام 💵' : 'Paiement à la livraison 💵'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#141418] p-2.5 rounded-lg border border-[#222228]">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span className="font-semibold text-[#D4AF37]">
                  {lang === 'ar' ? 'معاينة وتفقد الطرد قبل الدفع (Vérifiable avant paiement)' : 'Vérifiable avant paiement 🔍'}
                </span>
              </div>
            </div>
          </div>

          {/* Social / Contact */}
          <div>
            <h5 className="text-sm font-bold text-[#F5F2ED] mb-3">{t.nav.contact}</h5>
            <div className="flex flex-col gap-2.5 text-xs text-[#A8A8A8] items-center md:items-start">
              <a
                href="https://wa.me/213792090250"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-[#25D366] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp: +213 792 090 250</span>
              </a>
              <a
                href="https://instagram.com/dziria_accessoires"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-[#E5C378] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#E5C378]" />
                <span>Instagram: @dziria_accessoires</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-[#1a1a20] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start text-xs text-[#7A7A85]">
          <div className="flex items-center gap-2">
            <span className="font-black tracking-tight text-[#F5F2ED]">DZIRIA</span>
            <span className="font-extrabold tracking-widest text-[#D4AF37] uppercase text-[10px]">ACCESSOIRES</span>
            <span className="text-[#444]">•</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div>{t.footerRights}</div>
        </div>
      </div>
    </footer>
  );
};
