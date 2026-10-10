import React, { useState, useEffect } from 'react';
import { Language, translations } from '../data/translations';
import { SupplyListing } from '../types/agriculture';
import { X, PlusCircle, Sprout, Scale, IndianRupee, Sparkles, AlertCircle } from 'lucide-react';

interface AddProduceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduce: (newProduce: Omit<SupplyListing, 'id'>) => void;
  language?: Language;
}

const PRESET_CROPS = [
  { name: 'Tomato', mrName: 'टोमॅटो', defaultVariety: 'Abhinav Hybrid' },
  { name: 'Red Onion', mrName: 'कांदा', defaultVariety: 'Nashik Garwa' },
  { name: 'Green Chilli', mrName: 'हिरवी मिरची', defaultVariety: 'G4 Teja' },
  { name: 'Pomegranate', mrName: 'डाळिंब', defaultVariety: 'Bhagwa Red' },
  { name: 'Fresh Ginger', mrName: 'आले', defaultVariety: 'Mahim Ginger' },
  { name: 'Capsicum (Shimla Mirch)', mrName: 'ढोबळी मिरची', defaultVariety: 'Indra Hybrid' },
  { name: 'Fresh Garlic', mrName: 'लसूण', defaultVariety: 'G-282 Bold' },
  { name: 'Cauliflower', mrName: 'फ्लॉवर', defaultVariety: 'Snowball 16' },
];

export const AddProduceModal: React.FC<AddProduceModalProps> = ({
  isOpen,
  onClose,
  onAddProduce,
  language = 'en',
}) => {
  const t = translations[language];

  const [cropName, setCropName] = useState('Tomato');
  const [customCropName, setCustomCropName] = useState('');
  const [availableKg, setAvailableKg] = useState<number | ''>(100);
  const [basePrice, setBasePrice] = useState<number | ''>(28);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCrop = cropName === 'Other' ? customCropName.trim() : cropName;

    if (!finalCrop) {
      setErrorMsg(language === 'mr' ? 'कृपया पिकाचे नाव टाका.' : 'Please enter or select a crop name.');
      return;
    }

    const qty = Number(availableKg);
    if (!qty || qty <= 0) {
      setErrorMsg(language === 'mr' ? 'कृपया उपलब्ध प्रमाण (kg) योग्य भरा.' : 'Please enter a valid quantity in kg.');
      return;
    }

    const price = Number(basePrice);
    if (!price || price <= 0) {
      setErrorMsg(language === 'mr' ? 'कृपया दर (₹/kg) योग्य भरा.' : 'Please enter a valid base price in ₹/kg.');
      return;
    }

    setErrorMsg(null);

    // Find matched preset for Marathi name & variety
    const matchedPreset = PRESET_CROPS.find(
      (c) => c.name.toLowerCase() === finalCrop.toLowerCase()
    );

    const newSupplyData: Omit<SupplyListing, 'id'> = {
      farmerName: 'Ramesh Patil',
      farmerPhone: '+91 98229 11029',
      cropName: finalCrop,
      cropHindi: matchedPreset ? matchedPreset.mrName : finalCrop,
      variety: matchedPreset ? matchedPreset.defaultVariety : 'Fresh Local Harvest',
      availableKg: qty,
      location: 'Sangamner',
      distanceKm: 2.4,
      expectedPricePerKg: price,
      grade: 'Grade A',
      harvestStatus: 'Harvested Today',
      organicCertified: true,
      farmName: 'Patil Agro Farm',
    };

    onAddProduce(newSupplyData);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-produce-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-200 text-xs font-semibold">
              <Sprout className="w-3.5 h-3.5 text-emerald-300" />
              <span>{language === 'mr' ? 'रमेश पाटील · शेतमाल नोंदणी' : 'Ramesh Patil · Harvest Inventory'}</span>
            </div>
            <h2 id="add-produce-title" className="text-xl sm:text-2xl font-bold tracking-tight">
              {t.listNewProduce}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-normal">
              {t.listNewProduceSub}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-emerald-100 hover:text-white rounded-lg hover:bg-emerald-700/50 transition-colors cursor-pointer"
            aria-label={t.cancel}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Crop Selection */}
          <div className="space-y-1.5">
            <label htmlFor="crop-select" className="block text-xs font-bold text-stone-700">
              {t.cropNameLabel}
            </label>
            <div className="relative">
              <select
                id="crop-select"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-medium focus:bg-white focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              >
                {PRESET_CROPS.map((crop) => (
                  <option key={crop.name} value={crop.name}>
                    {crop.name} {language === 'mr' ? `(${crop.mrName})` : ''}
                  </option>
                ))}
                <option value="Other">
                  {language === 'mr' ? 'इतर पीक (टाईप करा)' : 'Other Crop (Custom)'}
                </option>
              </select>
            </div>

            {cropName === 'Other' && (
              <div className="pt-2">
                <input
                  type="text"
                  placeholder={language === 'mr' ? 'पिकाचे नाव टाईप करा (उदा. वांगी, कोथिंबीर)' : 'Type crop name (e.g. Brinjal, Coriander)'}
                  value={customCropName}
                  onChange={(e) => setCustomCropName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* 2. Quantity Available in Kg */}
          <div className="space-y-1.5">
            <label htmlFor="quantity-input" className="block text-xs font-bold text-stone-700">
              {t.quantityAvailableLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Scale className="w-4 h-4 text-emerald-600" />
              </div>
              <input
                id="quantity-input"
                type="number"
                min="1"
                step="1"
                value={availableKg}
                onChange={(e) => setAvailableKg(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10) || 0))}
                placeholder="100"
                className="w-full pl-10 pr-14 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono font-bold text-stone-900 focus:bg-white focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-500 text-xs font-bold">
                kg
              </div>
            </div>
          </div>

          {/* 3. Base Price in ₹/kg */}
          <div className="space-y-1.5">
            <label htmlFor="price-input" className="block text-xs font-bold text-stone-700">
              {t.basePriceLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
              </div>
              <input
                id="price-input"
                type="number"
                min="1"
                step="0.5"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value === '' ? '' : Math.max(1, parseFloat(e.target.value) || 0))}
                placeholder="25"
                className="w-full pl-10 pr-16 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono font-bold text-stone-900 focus:bg-white focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-500 text-xs font-bold">
                ₹/kg
              </div>
            </div>
          </div>

          {/* Live Estimated Lot Value Preview */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'mr' ? 'एकूण अंदाजे लॉट मूल्य:' : 'Estimated Lot Value:'}</span>
            </div>
            <div className="font-mono text-emerald-900 font-extrabold text-sm tabular-nums">
              ₹{((Number(availableKg) || 0) * (Number(basePrice) || 0)).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.publishListing}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
