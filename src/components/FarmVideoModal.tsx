import React, { useEffect } from 'react';
import { SupplyListing } from '../types/agriculture';
import { Language } from '../data/translations';
import { X, Play, ShieldCheck, MapPin, Sparkles, Volume2, Maximize2 } from 'lucide-react';

interface FarmVideoModalProps {
  supply: SupplyListing | null;
  onClose: () => void;
  language?: Language;
}

export const FarmVideoModal: React.FC<FarmVideoModalProps> = ({
  supply,
  onClose,
  language = 'en',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!supply) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/75 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-stone-950 text-white rounded-2xl shadow-2xl border border-stone-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="bg-emerald-900/90 border-b border-emerald-800/60 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center text-white">
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            </div>
            <div>
              <span className="text-emerald-300 text-xs font-semibold block">
                {language === 'mr' ? 'थेट शेतातील व्हिडिओ पडताळणी' : 'Live Farm Footage & Harvest Proof'}
              </span>
              <h2 id="video-modal-title" className="text-sm sm:text-base font-bold text-white">
                {supply.farmName} · {supply.farmerName}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close farm video modal"
            className="w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Canvas / Simulation */}
        <div className="relative bg-stone-900 aspect-video w-full flex items-center justify-center overflow-hidden group">
          {/* Simulated Organic Farm Footage Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 opacity-90" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/20 via-transparent to-black/80" />

          {/* Farm Watermark & Live Stamp */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600/90 text-white font-mono text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              LIVE PROOF
            </span>
            <span className="px-2 py-0.5 rounded-md bg-black/60 text-stone-200 font-mono text-xs backdrop-blur-xs">
              08:30 AM IST
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              GPS Verified
            </span>
          </div>

          {/* Center Play Button Overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center p-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 cursor-pointer transform hover:scale-105 transition-all">
              <Play className="w-7 h-7 fill-white ml-1" />
            </div>
            <p className="text-xs text-stone-300 font-medium max-w-xs">
              {language === 'mr'
                ? `${supply.farmerName} यांच्या ${supply.cropHindi || supply.cropName} पिकाची प्रत्यक्ष पाहणी`
                : `Verified batch scan of ${supply.cropName} (${supply.variety})`}
            </p>
          </div>

          {/* Video Control Bar simulation */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 flex items-center justify-between text-xs text-stone-300 z-10">
            <div className="flex items-center gap-3">
              <Play className="w-3.5 h-3.5 fill-stone-300 text-stone-300" />
              <Volume2 className="w-3.5 h-3.5 text-stone-300" />
              <span className="font-mono text-[11px]">00:18 / 01:05</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-400">1080p HD</span>
              <Maximize2 className="w-3.5 h-3.5 text-stone-300" />
            </div>
          </div>
        </div>

        {/* Video Metadata & Farm Notes */}
        <div className="p-4 sm:p-5 space-y-3 bg-stone-950 overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800 text-xs">
            <div className="flex items-center gap-1.5 text-stone-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{supply.location} · {supply.distanceKm} km from Sangamner Hub</span>
            </div>
            <span className="text-emerald-400 font-semibold font-mono">
              ₹{supply.expectedPricePerKg}/kg
            </span>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-3 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'गुणवत्ता पडताळणी नोंद' : 'Agronomist Inspection Log'}</span>
            </div>
            <p className="text-stone-300 leading-relaxed text-[11px] sm:text-xs">
              {language === 'mr'
                ? `मालाची प्रतवारी: ${supply.grade}. काढणी: ${supply.harvestStatus}. ग्रेडिंग क्रेट्समध्ये व्यवस्थित भरलेली आहे. बांधावरून थेट गाडी भरता येईल.`
                : `Batch Grade: ${supply.grade}. Harvest state: ${supply.harvestStatus}. Organically nourished with micro-drip irrigation. Crates ready for immediate farmgate collection.`}
            </p>
          </div>

          <div className="flex items-center justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 min-h-[40px] bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {language === 'mr' ? 'बंद करा' : 'Close Video'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
