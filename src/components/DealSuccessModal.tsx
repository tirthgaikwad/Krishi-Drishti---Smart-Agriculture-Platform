import React, { useState } from 'react';
import { BuyerMatch } from '../types/agriculture';
import { Language, translations } from '../data/translations';
import { CheckCircle2, Phone, Calendar, MapPin, Download, X, ShieldCheck, Check } from 'lucide-react';

interface DealSuccessModalProps {
  match: BuyerMatch | null;
  onClose: () => void;
  language?: Language;
}

export const DealSuccessModal: React.FC<DealSuccessModalProps> = ({ match, onClose, language = 'en' }) => {
  if (!match) return null;
  const t = translations[language];

  const [isDownloaded, setIsDownloaded] = useState(false);
  const dealToken = match.id === 'req-001' ? 'KD-8821' : `KD-88${match.id.replace('req-', '')}`;

  const handleDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => {
      setIsDownloaded(false);
    }, 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="deal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header Ribbon - Fixed shrink-0 */}
        <div className="bg-emerald-800 text-white p-4 sm:p-5 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-white shrink-0">
              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-300" />
            </div>
            <div>
              <span className="text-emerald-200 text-xs font-semibold tracking-wide uppercase">
                {t.dealConfirmed} · Token #{dealToken}
              </span>
              <h2 id="deal-modal-title" className="text-base sm:text-lg font-bold text-white break-words">
                {language === 'mr' ? 'मागणी स्वीकारली!' : 'Request Accepted!'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            title="Close modal"
            className="w-9 h-9 rounded-full bg-emerald-900/70 hover:bg-emerald-900 border border-emerald-600/50 flex items-center justify-center text-white hover:text-emerald-100 transition-all cursor-pointer shrink-0 shadow-xs ml-2"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 text-emerald-950">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60">
              <div>
                <p className="text-xs text-emerald-700 font-medium">{language === 'mr' ? 'खरेदीदार संस्था' : 'Buyer Organization'}</p>
                <p className="text-base font-bold text-emerald-950">{match.buyerName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-emerald-700 font-medium">{language === 'mr' ? 'एकूण मोबदला' : 'Total Agreed Payout'}</p>
                <p className="text-lg font-mono font-bold text-emerald-900 tabular-nums">
                  ₹{match.totalOfferValue.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
              <div>
                <span className="text-stone-500 block">{language === 'mr' ? 'शेतमाल व वजन' : 'Produce & Qty'}</span>
                <span className="font-semibold text-stone-800 font-mono tabular-nums">
                  {match.quantityKg} kg {language === 'mr' ? 'टोमॅटो' : match.cropName}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">{language === 'mr' ? 'ठरलेला दर' : 'Agreed Price'}</span>
                <span className="font-semibold text-emerald-800 font-mono tabular-nums">
                  ₹{match.offeredPricePerKg}/kg
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">{language === 'mr' ? 'वितरण पद्धत' : 'Delivery Method'}</span>
                <span className="font-semibold text-stone-800">{match.deliveryType}</span>
              </div>
              <div>
                <span className="text-stone-500 block">{language === 'mr' ? 'वेळ' : 'Timeline'}</span>
                <span className="font-semibold text-stone-800">{match.urgency}</span>
              </div>
            </div>
          </div>

          {/* Buyer Contact Card */}
          <div className="border border-stone-200 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                {language === 'mr' ? 'खरेदीदार संपर्क व माल भरणा ठिकाण' : 'Buyer Contact & Dispatch Point'}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                {language === 'mr' ? 'पडताळलेला खरेदीदार' : 'Verified Buyer'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-800">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {match.location} ({match.distanceKm} km {language === 'mr' ? 'अंतर' : 'from your farm'})
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="text-xs text-stone-600">
                <p className="font-medium text-stone-900">{match.contactPerson}</p>
                <p className="font-mono tabular-nums">{match.phone}</p>
              </div>
              <a
                href={`tel:${match.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.callBuyer}</span>
              </a>
            </div>
          </div>

          {/* Krishi Drishti Guarantee Note */}
          <p className="text-xs text-stone-500 leading-relaxed">
            {language === 'mr'
              ? `रमेश पाटील आणि ${match.buyerName} यांना SMS पाठवण्यात आला आहे. डिजिटल वजन पावतीनंतर कृषी दृष्टी सुरक्षित UPI द्वारे खात्यात थेट पैसे जमा होतील.`
              : `An SMS confirmation has been dispatched to Ramesh Patil and ${match.buyerName}. Payment will be escrowed via Krishi Drishti Direct UPI upon digital weight slip approval.`}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownload}
              className={`inline-flex items-center gap-1.5 px-4 py-2 border text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                isDownloaded
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {isDownloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'mr' ? 'पावती डाऊनलोड झाली ✓' : 'Challan Downloaded ✓'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-stone-500" />
                  <span>{t.downloadChallan}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              {t.doneAndReturn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
