import React from 'react';
import { TrendingUp, ArrowUpRight, Radio } from 'lucide-react';
import { Language, translations } from '../data/translations';

interface MandiTickerProps {
  language: Language;
}

export const MandiTicker: React.FC<MandiTickerProps> = ({ language }) => {
  const t = translations[language];

  const tickerItems = [
    { crop: language === 'mr' ? 'संगमनेर टोमॅटो' : 'Sangamner Tomato', price: '₹24 - ₹26/kg', change: '+8.2%', up: true },
    { crop: language === 'mr' ? 'लासलगाव कांदा' : 'Lasalgaon Onion', price: '₹34 - ₹36/kg', change: '+5.4%', up: true },
    { crop: language === 'mr' ? 'कोपरगाव मिरची' : 'Kopargaon Chilli', price: '₹42 - ₹46/kg', change: '+1.1%', up: true },
    { crop: language === 'mr' ? 'संगमनेर डाळिंब' : 'Sangamner Pomegranate', price: '₹105 - ₹120/kg', change: '+12.5%', up: true },
    { crop: language === 'mr' ? 'राहुरी सोयाबीन' : 'Rahuri Soybean', price: '₹4,450/qtl', change: '+2.0%', up: true },
    { crop: language === 'mr' ? 'अकोले आले' : 'Akole Ginger', price: '₹75 - ₹80/kg', change: '+4.1%', up: true },
  ];

  // Duplicate items for continuous linear infinite loop
  const duplicatedItems = [...tickerItems, ...tickerItems];

  return (
    <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-3 sm:px-4 border-b border-emerald-900/60 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Child 1: Mandi Status Indicator */}
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wide uppercase text-[11px] shrink-0 bg-emerald-950 z-10 pr-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Radio className="w-3.5 h-3.5 inline" />
          <span className="hidden xs:inline">{t.apmcLiveMandi}</span>
          <span className="xs:hidden">APMC</span>
        </div>

        {/* Child 2: Linear Moving Ticker Track */}
        <div className="flex-1 min-w-0 overflow-hidden relative cursor-default">
          {/* Subtle gradient masks for smooth entry/exit */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-emerald-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-emerald-950 to-transparent z-10 pointer-events-none" />

          <div
            className="animate-linear-ticker flex items-center gap-6 whitespace-nowrap text-stone-300 py-0.5"
            title="Hover to pause live feed"
          >
            {duplicatedItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 shrink-0">
                <span className="font-medium text-stone-200">{item.crop}:</span>
                <span className="font-mono tabular-nums text-white font-semibold">{item.price}</span>
                <span className="flex items-center text-emerald-400 text-[11px] font-medium">
                  <ArrowUpRight className="w-3 h-3 inline" />
                  {item.change}
                </span>
                <span className="text-emerald-800 ml-4 font-bold" aria-hidden="true">·</span>
              </div>
            ))}
          </div>
        </div>

        {/* Child 3: Last updated timestamp */}
        <div className="hidden lg:flex items-center gap-2 text-stone-400 text-[11px] shrink-0 font-medium bg-emerald-950 z-10 pl-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.updatedAgo}</span>
        </div>
      </div>
    </div>
  );
};
