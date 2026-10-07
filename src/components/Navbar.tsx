import React from 'react';
import { Sprout, ShoppingBag, MapPin, Globe } from 'lucide-react';
import { Language, translations } from '../data/translations';

interface NavbarProps {
  currentView: 'farmer' | 'buyer';
  onViewChange: (view: 'farmer' | 'buyer') => void;
  pendingRequestsCount: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  pendingRequestsCount,
  language,
  onLanguageChange,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* On desktop (sm:), use a 3-column grid so the center toggle is mathematically centered in the viewport */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center py-2.5 sm:py-0 sm:h-20 gap-2.5 sm:gap-4">
          {/* Column 1: Brand Wordmark (Aligned Left) */}
          <div className="flex items-center justify-between w-full sm:w-auto sm:justify-self-start gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-700 flex items-center justify-center shadow-sm text-white shrink-0">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-black tracking-tight text-stone-900 font-sans">
                  Krishi<span className="text-emerald-700">Drishti</span>
                </span>
                <p className="text-xs font-medium text-stone-500 -mt-0.5 hidden xs:block">
                  कृषी दृष्टी · {language === 'mr' ? 'स्मार्ट कृषी बाजार' : 'Smart Agri Exchange'}
                </p>
              </div>
            </div>

            {/* Mobile-only cluster: Language Toggle & Profile Avatar */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => onLanguageChange(language === 'en' ? 'mr' : 'en')}
                aria-label="Switch Language"
                title="Toggle English / मराठी"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-800" />
                <span className={language === 'en' ? 'text-emerald-800 font-bold' : 'text-stone-600'}>
                  EN
                </span>
                <span className="text-stone-400" aria-hidden="true">|</span>
                <span className={language === 'mr' ? 'text-emerald-800 font-bold' : 'text-stone-600'}>
                  MR
                </span>
              </button>

              <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs">
                {currentView === 'farmer' ? 'RP' : 'KD'}
              </div>
            </div>
          </div>

          {/* Column 2: View Switcher Toggle (Centered in header on desktop, full-width on mobile) */}
          <div className="w-full sm:w-auto flex justify-center sm:justify-self-center">
            <div
              role="tablist"
              aria-label="Select Dashboard View"
              className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200 max-w-md sm:max-w-none"
            >
              <button
                role="tab"
                aria-selected={currentView === 'farmer'}
                onClick={() => onViewChange('farmer')}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 min-h-[40px] text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  currentView === 'farmer'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Sprout className={`w-4 h-4 shrink-0 ${currentView === 'farmer' ? 'text-emerald-200' : 'text-stone-600'}`} />
                <span>{t.farmerDashboard}</span>
                {pendingRequestsCount > 0 && currentView !== 'farmer' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                )}
              </button>

              <button
                role="tab"
                aria-selected={currentView === 'buyer'}
                onClick={() => onViewChange('buyer')}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 min-h-[40px] text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  currentView === 'buyer'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <ShoppingBag className={`w-4 h-4 shrink-0 ${currentView === 'buyer' ? 'text-emerald-200' : 'text-stone-600'}`} />
                <span>{t.buyerDashboard}</span>
              </button>
            </div>
          </div>

          {/* Column 3: Desktop only Actions & Active Profile Status (Aligned Right) */}
          <div className="hidden sm:flex items-center gap-3 sm:justify-self-end">
            {/* Elegant Language Toggle Button in Nav */}
            <button
              type="button"
              onClick={() => onLanguageChange(language === 'en' ? 'mr' : 'en')}
              aria-label="Switch Language"
              title="Toggle English / मराठी"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-800" />
              <span className={language === 'en' ? 'text-emerald-800 font-bold' : 'text-stone-600'}>
                EN
              </span>
              <span className="text-stone-400" aria-hidden="true">|</span>
              <span className={language === 'mr' ? 'text-emerald-800 font-bold' : 'text-stone-600'}>
                MR
              </span>
            </button>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-lg min-h-[38px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="font-medium text-stone-900">
                {language === 'mr' ? 'संगमनेर, महा' : 'Sangamner, MH'}
              </span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs">
                {currentView === 'farmer' ? 'RP' : 'KD'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-stone-900 leading-tight">
                  {currentView === 'farmer' ? (language === 'mr' ? 'रमेश पाटील' : 'Ramesh Patil') : (language === 'mr' ? 'कुणाल देशमुख' : 'Kunal Deshmukh')}
                </p>
                <p className="text-xs text-emerald-800 font-medium">
                  {currentView === 'farmer' ? (language === 'mr' ? 'सेंद्रिय शेतकरी' : 'Organic Farmer') : (language === 'mr' ? 'पडताळलेला खरेदीदार' : 'Verified Buyer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
