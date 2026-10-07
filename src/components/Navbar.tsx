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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-2.5 sm:py-0 sm:h-20 gap-2.5 sm:gap-4">
          {/* Top row on mobile: Logo on left, Language Toggle & Avatar on right */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            {/* Zone 1: Brand Wordmark */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-md shadow-emerald-700/20 text-white shrink-0">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-black tracking-tight text-emerald-950 font-sans">
                  Krishi<span className="text-emerald-600">Drishti</span>
                </span>
                <p className="text-[10px] sm:text-[11px] font-medium text-stone-600 -mt-0.5 hidden xs:block">
                  कृषी दृष्टी · {language === 'mr' ? 'स्मार्ट कृषी बाजार' : 'Smart Agri Exchange'}
                </p>
              </div>
            </div>

            {/* Mobile-only right cluster: Language Toggle & Avatar */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => onLanguageChange(language === 'en' ? 'mr' : 'en')}
                aria-label="Switch Language"
                title="Toggle English / मराठी"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200/80 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span className={language === 'en' ? 'text-emerald-800 underline decoration-emerald-600 font-extrabold' : 'text-stone-500'}>
                  EN
                </span>
                <span className="text-stone-300">|</span>
                <span className={language === 'mr' ? 'text-emerald-800 underline decoration-emerald-600 font-extrabold' : 'text-stone-500'}>
                  MR
                </span>
              </button>

              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs shadow-xs">
                {currentView === 'farmer' ? 'RP' : 'KD'}
              </div>
            </div>
          </div>

          {/* Zone 2: View Switcher Toggle (Centered, flexible width on mobile) */}
          <div className="w-full sm:w-auto flex justify-center">
            <div
              role="tablist"
              aria-label="Select Dashboard View"
              className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex p-1 bg-stone-100/90 rounded-xl border border-stone-200/90 shadow-inner max-w-md sm:max-w-none"
            >
              <button
                role="tab"
                aria-selected={currentView === 'farmer'}
                onClick={() => onViewChange('farmer')}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  currentView === 'farmer'
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/25'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <Sprout className={`w-4 h-4 shrink-0 ${currentView === 'farmer' ? 'text-emerald-200' : 'text-stone-500'}`} />
                <span>{t.farmerDashboard}</span>
                {pendingRequestsCount > 0 && currentView !== 'farmer' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                )}
              </button>

              <button
                role="tab"
                aria-selected={currentView === 'buyer'}
                onClick={() => onViewChange('buyer')}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  currentView === 'buyer'
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/25'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <ShoppingBag className={`w-4 h-4 shrink-0 ${currentView === 'buyer' ? 'text-emerald-200' : 'text-stone-500'}`} />
                <span>{t.buyerDashboard}</span>
              </button>
            </div>
          </div>

          {/* Zone 3: Desktop only Actions & Active Profile Status */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            {/* Elegant Language Toggle Button in Nav */}
            <button
              type="button"
              onClick={() => onLanguageChange(language === 'en' ? 'mr' : 'en')}
              aria-label="Switch Language"
              title="Toggle English / मराठी"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200/80 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span className={language === 'en' ? 'text-emerald-800 underline decoration-emerald-600' : 'text-stone-500'}>
                EN
              </span>
              <span className="text-stone-300">|</span>
              <span className={language === 'mr' ? 'text-emerald-800 underline decoration-emerald-600' : 'text-stone-500'}>
                MR
              </span>
            </button>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 border border-stone-200/80 px-2.5 py-1.5 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium text-stone-800">
                {language === 'mr' ? 'संगमनेर, महा' : 'Sangamner, MH'}
              </span>
            </div>

            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-stone-200">
              <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs shadow-xs">
                {currentView === 'farmer' ? 'RP' : 'KD'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-stone-900 leading-tight">
                  {currentView === 'farmer' ? (language === 'mr' ? 'रमेश पाटील' : 'Ramesh Patil') : (language === 'mr' ? 'कुणाल देशमुख' : 'Kunal Deshmukh')}
                </p>
                <p className="text-[10px] text-emerald-700 font-medium">
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
