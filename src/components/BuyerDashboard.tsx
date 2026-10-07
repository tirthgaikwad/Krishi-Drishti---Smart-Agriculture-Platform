import React, { useState } from 'react';
import { SupplyListing, PreOrderConfirmation } from '../types/agriculture';
import { Language, translations } from '../data/translations';
import {
  Search,
  MapPin,
  X,
  ShieldCheck,
  Package,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';

interface BuyerDashboardProps {
  supplies: SupplyListing[];
  onOpenPreOrder: (supply: SupplyListing) => void;
  recentOrders: PreOrderConfirmation[];
  language?: Language;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  supplies,
  onOpenPreOrder,
  recentOrders,
  language = 'en',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [showOnlyOrganic, setShowOnlyOrganic] = useState(false);
  const t = translations[language];

  const cropCategories = [
    { id: 'All', label: language === 'mr' ? 'सर्व' : 'All' },
    { id: 'Tomato', label: language === 'mr' ? 'टोमॅटो' : 'Tomato' },
    { id: 'Red Onion', label: language === 'mr' ? 'कांदा' : 'Red Onion' },
    { id: 'Green Chilli', label: language === 'mr' ? 'मिरची' : 'Green Chilli' },
    { id: 'Pomegranate', label: language === 'mr' ? 'डाळिंब' : 'Pomegranate' },
    { id: 'Fresh Ginger', label: language === 'mr' ? 'आले' : 'Fresh Ginger' },
  ];

  const locations = [
    { id: 'All', label: language === 'mr' ? 'सर्व ठिकाणे' : 'All Locations' },
    { id: 'Sangamner', label: language === 'mr' ? 'संगमनेर' : 'Sangamner' },
    { id: 'Rahuri', label: language === 'mr' ? 'राहुरी' : 'Rahuri' },
    { id: 'Kopargaon', label: language === 'mr' ? 'कोपरगाव' : 'Kopargaon' },
    { id: 'Akole', label: language === 'mr' ? 'अकोले' : 'Akole' },
  ];

  // Filter supplies
  const filteredSupplies = supplies.filter((item) => {
    // Search query matches crop, farmer, location, or variety
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchesSearch =
        item.cropName.toLowerCase().includes(q) ||
        (item.cropHindi && item.cropHindi.toLowerCase().includes(q)) ||
        item.farmerName.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.variety.toLowerCase().includes(q) ||
        item.farmName.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Crop category filter
    if (selectedCrop !== 'All' && !item.cropName.toLowerCase().includes(selectedCrop.toLowerCase())) {
      return false;
    }

    // Location filter
    if (selectedLocation !== 'All' && item.location.toLowerCase() !== selectedLocation.toLowerCase()) {
      return false;
    }

    // Organic filter
    if (showOnlyOrganic && !item.organicCertified) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Buyer Sourcing Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-lg shadow-stone-950/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span>{language === 'mr' ? 'व्यापारी थेट शेतकरी खरेदी मंच' : 'Commercial Procurement & Hospitality Direct-Link'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-sans">
              {t.buyerHeader}
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 max-w-xl font-normal leading-relaxed">
              {t.buyerSub}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-800/80 backdrop-blur-xs border border-stone-700/60 p-3 sm:p-4 rounded-xl shrink-0">
            <div>
              <span className="text-xs text-stone-300 block font-medium">{language === 'mr' ? 'उपलब्ध शेतमाल' : 'Available Volume'}</span>
              <span className="text-lg font-bold font-mono text-white tabular-nums">1,450 kg</span>
              <span className="text-xs text-emerald-300 block font-medium">{language === 'mr' ? '६ स्थानिक शेतांतून' : 'Across 6 Local Farms'}</span>
            </div>
            <div className="h-8 w-px bg-stone-700" />
            <div>
              <span className="text-xs text-stone-300 block font-medium">{language === 'mr' ? 'तुमच्या प्री-ऑर्डर्स' : 'Your Pre-orders'}</span>
              <span className="text-lg font-bold font-mono text-emerald-300 tabular-nums">
                {recentOrders.length} {language === 'mr' ? 'निश्चित' : 'Confirmed'}
              </span>
              <span className="text-xs text-stone-300 block">{language === 'mr' ? 'आजचे वितरण' : "Today's Dispatch"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search Bar & Filters */}
      <section aria-labelledby="search-section-heading" className="space-y-4">
        <h2 id="search-section-heading" className="sr-only">
          {t.searchProduce}
        </h2>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 space-y-4">
          {/* Main Search Input with Accessible Label */}
          <div className="relative">
            <label htmlFor="produce-search-input" className="sr-only">
              {t.searchProduce}
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="produce-search-input"
              name="search"
              type="search"
              aria-label={t.searchProduce}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchProduce}
              className="w-full pl-11 pr-10 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm sm:text-base text-stone-900 placeholder:text-stone-500 focus:bg-white focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Controls: Crop Categories & Location */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Crop Category Buttons - Horizontally scrollable on mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1.5 sm:pb-0 w-full min-w-0">
              <span className="text-xs font-semibold text-stone-600 mr-1 hidden md:inline shrink-0">
                {language === 'mr' ? 'पीक:' : 'Crop:'}
              </span>
              {cropCategories.map((crop) => (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => setSelectedCrop(crop.id)}
                  className={`px-3.5 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center justify-center ${
                    selectedCrop === crop.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {crop.label}
                </button>
              ))}
            </div>

            {/* Sub-Filters: Location & Organic */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 text-xs">
              <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1 border border-stone-200 min-h-[36px]">
                <MapPin className="w-3.5 h-3.5 text-stone-600 ml-1" />
                <select
                  aria-label="Filter produce by location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-hidden pr-2 cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowOnlyOrganic(!showOnlyOrganic)}
                className={`px-3.5 py-1.5 min-h-[36px] rounded-lg border font-semibold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center justify-center ${
                  showOnlyOrganic
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-stone-200 bg-stone-100 text-stone-700 hover:text-stone-900 hover:bg-stone-200/70'
                }`}
              >
                {t.organicOnly}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION TITLED "Local Supply" (स्थानिक पुरवठा) */}
      <section aria-labelledby="local-supply-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="local-supply-heading" className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                {t.localSupply}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono">
                {filteredSupplies.length} {t.availableLots}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              {t.localSupplySub}
            </p>
          </div>

          <span className="text-xs text-stone-600">
            {t.sortDistance}
          </span>
        </div>

        {/* Local Supply Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredSupplies.map((item) => {
            const displayCropName = language === 'mr' ? item.cropHindi : item.cropName;
            const displayCropSub = language === 'mr' ? item.cropName : item.cropHindi;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3">
                  {/* Top Farmer & Location Line */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-stone-900">
                          {item.farmerName}
                        </span>
                        <span title="Verified Producer" className="text-emerald-800">
                          <ShieldCheck className="w-4 h-4 fill-emerald-100 text-emerald-700" />
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">{item.farmName}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-extrabold font-mono text-emerald-800 tabular-nums">
                        ₹{item.expectedPricePerKg}/kg
                      </span>
                      <span className="text-xs text-stone-600 block">{t.expectedRate}</span>
                    </div>
                  </div>

                  {/* Crop Headline */}
                  <div className="p-3 bg-stone-50/90 rounded-xl border border-stone-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-stone-900">
                        {displayCropName}{' '}
                        <span className="text-stone-600 text-xs font-normal">({displayCropSub})</span>
                      </h3>
                      <span className="text-xs font-bold font-mono text-stone-900 tabular-nums">
                        {item.availableKg} kg {t.available}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 line-clamp-1">{item.variety}</p>
                  </div>

                  {/* Metadata: Unboxed text with subtle typographic separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 pt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span>{item.location} ({item.distanceKm} km)</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-800 font-medium">
                      {language === 'mr'
                        ? (item.harvestStatus === 'Harvested Today' ? 'आजची काढणी' : item.harvestStatus === 'Harvested Yesterday' ? 'कालची काढणी' : 'काढणीस तयार')
                        : item.harvestStatus}
                    </span>
                    {item.organicCertified && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-800 font-semibold">{language === 'mr' ? 'सेंद्रिय' : 'Organic'}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Action: "Send Pre-order" / "प्री-ऑर्डर पाठवा" Button */}
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-3">
                  <div className="text-xs text-stone-600">
                    {language === 'mr' ? 'प्रतवारी:' : 'Grade:'} <strong className="text-stone-900">{item.grade}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenPreOrder(item)}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[42px] bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
                  >
                    <span>{t.sendPreOrder}</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSupplies.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-3">
            <Package className="w-10 h-10 text-stone-400 mx-auto" />
            <p className="text-sm font-semibold text-stone-800">
              {language === 'mr' ? 'या शोधासाठी कोणताही स्थानिक शेतमाल सापडला नाही' : 'No local produce matches your search'}
            </p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {language === 'mr' ? 'कृपया फिल्टर रीसेट करा किंवा वेगळा शेतमाल निवडा.' : 'Try adjusting your crop keyword, clearing filters, or exploring nearby APMC zones.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCrop('All');
                setSelectedLocation('All');
                setShowOnlyOrganic(false);
              }}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl cursor-pointer"
            >
              {language === 'mr' ? 'सर्व फिल्टर्स रीसेट करा' : 'Reset All Filters'}
            </button>
          </div>
        )}
      </section>

      {/* 4. Active Pre-orders Section */}
      {recentOrders.length > 0 && (
        <section aria-labelledby="active-orders-heading" className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 id="active-orders-heading" className="text-base font-bold text-stone-900">
              {language === 'mr' ? `तुमच्या पाठवलेल्या प्री-ऑर्डर्स (${recentOrders.length})` : `Your Sent Pre-Orders (${recentOrders.length})`}
            </h3>
            <span className="text-xs text-emerald-700 font-medium">
              {language === 'mr' ? 'शेतकऱ्यांशी जोडले गेले' : 'Auto-synced with farmers'}
            </span>
          </div>

          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl border border-stone-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">
                      Order #{order.orderId} · {order.quantityKg}kg {order.supply.cropName}
                    </p>
                    <p className="text-stone-500">
                      Farmer: {order.supply.farmerName} ({order.supply.location}) · Dispatch: {order.pickupDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <span className="font-mono font-bold text-emerald-800 text-sm tabular-nums">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
                    {language === 'mr' ? 'निश्चित' : order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
