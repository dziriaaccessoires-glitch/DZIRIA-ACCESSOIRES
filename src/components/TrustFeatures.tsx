import React from 'react';
import { Language } from '../types';
import { STR } from '../data/translations';
import { ShieldCheck, Truck, Banknote, Headphones } from 'lucide-react';

interface TrustFeaturesProps {
  lang: Language;
}

export const TrustFeatures: React.FC<TrustFeaturesProps> = ({ lang }) => {
  const t = STR[lang];

  const features = [
    {
      icon: ShieldCheck,
      title: t.trustQuality,
      sub: t.trustQualitySub,
    },
    {
      icon: Truck,
      title: t.trustDelivery,
      sub: t.trustDeliverySub,
    },
    {
      icon: Banknote,
      title: t.trustPayment,
      sub: t.trustPaymentSub,
    },
    {
      icon: Headphones,
      title: t.trustSupport,
      sub: t.trustSupportSub,
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="flex flex-col items-center sm:items-start text-center sm:text-start p-4 sm:p-5 rounded-2xl bg-[#141417] border border-[#232328] hover:border-[#D4AF37]/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C378] mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#F5F2ED] mb-1">{f.title}</h4>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">{f.sub}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
