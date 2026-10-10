import React, { useState } from 'react';
import { SupplyListing, PreOrderPayload, PreOrderConfirmation } from '../types/agriculture';
import { Language, translations } from '../data/translations';
import { useOrderContext } from '../context/OrderContext';
import {
  Search,
  MapPin,
  X,
  ShieldCheck,
  Package,
  ArrowUpRight,
  CheckCircle2,
  Check,
  Video,
  ShoppingCart
} from 'lucide-react';
import { FarmVideoModal } from './FarmVideoModal';
import { CheckoutModal } from './CheckoutModal';

interface BuyerDashboardProps {
  supplies: SupplyListing[];
  onOpenPreOrder: (supply: SupplyListing) => void;
  recentOrders: PreOrderConfirmation[];
  language?: Language;
  onToast?: (msg: string) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  supplies,
  onOpenPreOrder,
  recentOrders,
  language = 'en',
  onToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [showOnlyOrganic, setShowOnlyOrganic] = useState(false);

  // Video and Checkout Modals state
  const [videoModalSupply, setVideoModalSupply] = useState<SupplyListing | null>(null);
  const [checkoutModalSupply, setCheckoutModalSupply] = useState<SupplyListing | null>(null);

  const t = translations[language];

  // Shared state for order flow
  const { pendingOrders, sentSupplyIds, sendPreOrder } = useOrderContext();

  // Active accepted orders from farmer acceptance
  const acceptedOrders = pendingOrders.filter((o) => o.status === 'accepted');

  const handleOpenCheckout = (item: SupplyListing) => {
    setCheckoutModalSupply(item);
  };

  const handleConfirmCheckout = async (payload: PreOrderPayload): Promise<PreOrderConfirmation> => {
    const supply = supplies.find((s) => s.id === payload.supplyId);
    if (supply) {
      const fulfillment = (payload.fulfillmentMethod || payload.deliveryPreference || 'Farmgate Pickup') as 'Farmgate Pickup' | 'Farmer Delivery';
      const fee = payload.deliveryFee !== undefined ? payload.deliveryFee : (fulfillment === 'Farmer Delivery' ? 45 : 0);
      const calculatedTotal = payload.totalAmount !== undefined 
        ? payload.totalAmount 
        : Math.round(payload.quantityKg * payload.offeredPricePerKg + fee);

      const newOrder = sendPreOrder(
        supply,
        payload.quantityKg,
        fulfillment,
        calculatedTotal,
        fee
      );

      const toastFulfillment = fulfillment === 'Farmer Delivery'
        ? (language === 'mr' ? 'शेतकरी वितरण' : 'Farmer Delivery')
        : (language === 'mr' ? 'शेत बांधावर उचल' : 'Farmgate Pickup');

      const toastText = language === 'mr'
        ? `मागणी पाठवली! (${payload.quantityKg}kg ${supply.cropHindi || supply.cropName} · ${toastFulfillment} · ₹${newOrder.totalAmount})`
        : `Request Sent! (${payload.quantityKg}kg ${supply.cropName} · ${toastFulfillment} · ₹${newOrder.totalAmount})`;
      if (onToast) onToast(toastText);

      return {
        orderId: newOrder.orderToken.replace('#', ''),
        supply: supply,
        quantityKg: payload.quantityKg,
        totalAmount: newOrder.totalAmount,
        deliveryFee: fee,
        fulfillmentMethod: fulfillment,
        status: 'Pending Confirmation',
        pickupDate: payload.pickupDate,
        deliveryPreference: fulfillment,
        createdAt: 'Just now',
      };
    }
    throw new Error('Supply not found');
  };

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
              <span>{language === 'mr' ? 'कुणाल देशमुख · पडताळलेला खरेदीदार' : 'Kunal Deshmukh · Verified Commercial Buyer'}</span>
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
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                {supplies.reduce((acc, s) => acc + s.availableKg, 0).toLocaleString('en-IN')} kg
              </span>
              <span className="text-xs text-emerald-300 block font-medium">
                {language === 'mr'
                  ? `${new Set(supplies.map((s) => s.farmerName)).size} स्थानिक शेतांतून`
                  : `Across ${new Set(supplies.map((s) => s.farmerName)).size} Local Farms`}
              </span>
            </div>
            <div className="h-8 w-px bg-stone-700" />
            <div>
              <span className="text-xs text-stone-300 block font-medium">{language === 'mr' ? 'स्वीकारलेले सौदे' : 'Accepted Orders'}</span>
              <span className="text-lg font-bold font-mono text-emerald-300 tabular-nums">
                {acceptedOrders.length} {language === 'mr' ? 'निश्चित' : 'Active'}
              </span>
              <span className="text-xs text-stone-300 block">{language === 'mr' ? 'थेट बांधावर' : 'Farmgate Pickup'}</span>
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

      {/* 3. SECTION TITLED "Available Local Supply" (स्थानिक पुरवठा) */}
      <section aria-labelledby="local-supply-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="local-supply-heading" className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                {language === 'mr' ? 'उपलब्ध स्थानिक पुरवठा' : 'Available Local Supply'}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono">
                {filteredSupplies.length} {t.availableLots}
              </span>
            </div>
            <p className="text-xs text-stone-600">
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
            const isSent = sentSupplyIds.includes(item.id);

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

                {/* Bottom Actions: Button 1: "📹 View Farm Video" & Button 2: "🛒 Send Pre-order" */}
                <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <button
                    type="button"
                    onClick={() => setVideoModalSupply(item)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[40px] border border-stone-300 hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'mr' ? '📹 शेत व्हिडिओ पहा' : '📹 View Farm Video'}</span>
                  </button>

                  {isSent ? (
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-xl cursor-not-allowed opacity-90 shadow-2xs"
                    >
                      <Check className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                      <span>{t.requestSent}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenCheckout(item)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{t.sendPreOrder}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  )}
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

      {/* 4. "📦 My Active Orders" Section: Displays orders that the farmer has accepted */}
      <section aria-labelledby="active-orders-heading" className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 id="active-orders-heading" className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>{language === 'mr' ? '📦 माझ्या सक्रिय ऑर्डर्स' : '📦 My Active Orders'}</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
              {acceptedOrders.length} {language === 'mr' ? 'स्वीकृत' : 'Accepted'}
            </span>
          </div>
          <span className="text-xs text-emerald-800 font-medium">
            {language === 'mr' ? 'शेतकऱ्यांनी मंजूर केलेले सौदे' : 'Direct Farmer Confirmed'}
          </span>
        </div>

        {acceptedOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-stone-200 p-5 text-center space-y-2">
            <Package className="w-7 h-7 text-stone-400 mx-auto" />
            <p className="text-xs text-stone-600 font-medium">
              {language === 'mr'
                ? 'सध्या कोणतीही स्वीकृत ऑर्डर नाही. वरून प्री-ऑर्डर पाठवा आणि शेतकरी डॅशबोर्डवर जाऊन "स्वीकारा" वर क्लिक करा!'
                : 'No accepted orders yet. Send a pre-order above, then switch to Farmer Dashboard and click "Accept" to see it instantly updated here!'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {acceptedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-emerald-50/60 rounded-xl border border-emerald-300 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-stone-900">
                        {order.quantityKg}kg {language === 'mr' ? order.cropHindi : order.cropName}
                      </p>
                      <span className="font-mono text-xs font-semibold text-emerald-800 px-2 py-0.5 rounded-md bg-emerald-100">
                        Token {order.orderToken}
                      </span>
                    </div>
                    <p className="text-stone-600 mt-0.5">
                      {language === 'mr' ? 'शेतकरी:' : 'Farmer:'} <strong>{order.farmerName}</strong> ({order.location}) · {order.deliveryPreference}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-200">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-stone-500 block">{language === 'mr' ? 'निश्चित रक्कम' : 'Agreed Value'}</span>
                    <span className="font-mono font-extrabold text-emerald-900 text-base tabular-nums">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{language === 'mr' ? 'स्वीकारले ✓' : 'Accepted ✓'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Video Modal */}
      {videoModalSupply && (
        <FarmVideoModal
          supply={videoModalSupply}
          onClose={() => setVideoModalSupply(null)}
          language={language}
        />
      )}

      {/* Checkout Calculator Modal */}
      {checkoutModalSupply && (
        <CheckoutModal
          supply={checkoutModalSupply}
          onClose={() => setCheckoutModalSupply(null)}
          onConfirm={handleConfirmCheckout}
          language={language}
        />
      )}
    </div>
  );
};

