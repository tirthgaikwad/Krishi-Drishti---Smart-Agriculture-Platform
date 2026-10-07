import React, { useState } from 'react';
import { MarketInsight, BuyerMatch } from '../types/agriculture';
import { Language, translations } from '../data/translations';
import {
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  Clock,
  Check,
  Activity
} from 'lucide-react';

interface FarmerDashboardProps {
  insights: MarketInsight;
  allInsights: Record<string, MarketInsight>;
  selectedCropId: string;
  onSelectCrop: (cropId: string) => void;
  buyerMatches: BuyerMatch[];
  onAcceptRequest: (match: BuyerMatch) => void;
  isLoadingInsights?: boolean;
  language?: Language;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  insights,
  selectedCropId,
  onSelectCrop,
  buyerMatches,
  onAcceptRequest,
  language = 'en',
}) => {
  const [filterType, setFilterType] = useState<'all' | 'nearby' | 'highest'>('all');
  const t = translations[language];

  // Filter matches
  const filteredMatches = buyerMatches.filter((match) => {
    if (filterType === 'nearby') return match.distanceKm <= 5;
    if (filterType === 'highest') return match.offeredPricePerKg >= 26;
    return true;
  });

  const availableCrops = [
    { id: 'tomato', name: 'Tomato (टोमॅटो)', short: language === 'mr' ? 'टोमॅटो' : 'Tomato' },
    { id: 'onion', name: 'Red Onion (कांदा)', short: language === 'mr' ? 'कांदा' : 'Red Onion' },
    { id: 'chilli', name: 'Green Chilli (मिरची)', short: language === 'mr' ? 'मिरची' : 'Chilli' },
    { id: 'pomegranate', name: 'Pomegranate (डाळिंब)', short: language === 'mr' ? 'डाळिंब' : 'Bhagwa' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Personalized Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-lg shadow-emerald-950/20 relative overflow-hidden">
        {/* Subtle decorative agrarian background pattern */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <svg width="260" height="260" viewBox="0 0 200 200" fill="currentColor">
            <path d="M40 160 C 60 100, 100 80, 160 40 C 160 100, 140 140, 40 160 Z" />
            <path d="M70 150 C 90 120, 120 100, 150 70" stroke="white" strokeWidth="4" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span>{language === 'mr' ? 'पाटील सेंद्रिय शेत · संगमनेर APMC परिक्षेत्र' : 'Patil Organic Farm · Sangamner APMC Zone'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-sans">
              {t.goodMorningRamesh}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl font-normal leading-relaxed">
              {t.farmerSubtitle}
            </p>
          </div>

          {/* Quick Farm Quick-Stat Badges */}
          <div className="flex items-center gap-3 bg-emerald-950/60 backdrop-blur-xs border border-emerald-700/50 p-3 sm:p-4 rounded-xl shrink-0">
            <div>
              <span className="text-xs text-emerald-200 block font-medium">{t.readyProduce}</span>
              <span className="text-lg font-bold font-mono text-white tabular-nums">150 kg</span>
              <span className="text-xs text-emerald-300 block">{language === 'mr' ? 'अ-दर्जा हायब्रिड' : 'A-Grade Hybrid'}</span>
            </div>
            <div className="h-8 w-px bg-emerald-800" />
            <div>
              <span className="text-xs text-emerald-200 block font-medium">{t.activeInquiries}</span>
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                {buyerMatches.filter((m) => m.status === 'pending').length} {language === 'mr' ? 'व्यापारी' : 'buyers'}
              </span>
              <span className="text-xs text-emerald-300 block font-medium">{language === 'mr' ? 'उत्तम मागणी' : 'High Match'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROMINENT "Market Insights" Card */}
      <section aria-labelledby="market-insights-heading" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="market-insights-heading" className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {t.marketInsights}
            </h2>
            <p className="text-xs text-stone-600">
              {t.marketInsightsSub}
            </p>
          </div>

          {/* Crop Selector Segmented Control */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-stone-100 rounded-xl border border-stone-200 w-full sm:w-auto min-w-0">
            {availableCrops.map((crop) => (
              <button
                key={crop.id}
                type="button"
                onClick={() => onSelectCrop(crop.id)}
                className={`px-3.5 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center justify-center ${
                  selectedCropId === crop.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                {crop.short}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Market Insight Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-md hover:shadow-lg transition-shadow p-4 sm:p-7 relative overflow-hidden w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
            {/* Left Column: 3 Core Requirements (Trend, Demand, Expected Price) */}
            <div className="md:col-span-7 space-y-4 sm:space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                    {insights.mandiLocation} {language === 'mr' ? 'बाजारभाव' : 'Benchmark'}
                  </span>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-stone-900 break-words">
                    {language === 'mr' ? insights.cropHindi : insights.cropName}{' '}
                    <span className="text-stone-600 text-xs sm:text-sm font-medium">({language === 'mr' ? insights.cropName : insights.cropHindi})</span>
                  </h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-stone-600 block">{language === 'mr' ? 'आजची आवक' : 'Arrivals Volume'}</span>
                  <span className="text-xs font-medium text-stone-900 font-mono tabular-nums">
                    {insights.volumeArrivalsToday}
                  </span>
                </div>
              </div>

              {/* The 3 Prominently Displayed Core Metrics - Adaptive Grid for Mobile */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {/* 1. Trend (कल) */}
                <div className="bg-stone-50/90 border border-stone-200/80 rounded-xl p-2.5 sm:p-4 text-center sm:text-left transition-colors">
                  <span className="text-xs font-semibold text-stone-700 block uppercase tracking-wider">
                    {t.trend}
                  </span>
                  <div className="mt-1 flex items-center justify-center sm:justify-start gap-1">
                    <span className="text-xs sm:text-lg font-bold text-emerald-800">
                      {language === 'mr' ? (insights.trend === 'Increasing' ? 'वाढता' : insights.trend === 'Stable' ? 'स्थिर' : 'घसरता') : insights.trend}
                    </span>
                    <span className="text-sm sm:text-lg" aria-hidden="true">
                      {insights.trendIcon}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-800 font-semibold block mt-0.5 whitespace-nowrap">
                    {language === 'mr' ? '+18% वाढ' : '+18% this week'}
                  </span>
                </div>

                {/* 2. Demand (मागणी) */}
                <div className="bg-stone-50/90 border border-stone-200/80 rounded-xl p-2.5 sm:p-4 text-center sm:text-left transition-colors">
                  <span className="text-xs font-semibold text-stone-700 block uppercase tracking-wider">
                    {t.demand}
                  </span>
                  <div className="mt-1 flex items-center justify-center sm:justify-start gap-1">
                    <span className="inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-xs sm:text-lg font-bold text-emerald-900">
                      {language === 'mr' ? (insights.demand === 'High' ? 'उच्च' : 'मध्यम') : insights.demand}
                    </span>
                  </div>
                  <span className="text-xs text-stone-600 font-medium block mt-0.5 whitespace-nowrap">
                    {language === 'mr' ? 'खरेदीदार टंचाई' : 'Buyer Shortage'}
                  </span>
                </div>

                {/* 3. Expected Price (अपेक्षित दर) */}
                <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 sm:p-4 text-center sm:text-left transition-colors">
                  <span className="text-xs font-semibold text-emerald-800 block uppercase tracking-wider">
                    {t.expectedPrice}
                  </span>
                  <div className="mt-1">
                    <span className="text-xs sm:text-lg font-extrabold font-mono text-emerald-950 tabular-nums break-words">
                      ₹{insights.expectedPriceMin}-₹{insights.expectedPriceMax}
                    </span>
                    <span className="text-xs text-emerald-800 block">
                      /{language === 'mr' ? 'किलो' : insights.unit}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-800 font-semibold block mt-0.5 whitespace-nowrap hidden xs:block">
                    {language === 'mr' ? 'उत्तम बाजार' : 'Top Mandi'}
                  </span>
                </div>
              </div>

              {/* Recommendation Advisory Box */}
              <div className="flex items-start gap-3 p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-xs text-stone-700">
                <Sparkles className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-emerald-950">{t.mandiAdvisory}</strong> {insights.marketAdvice}
                </p>
              </div>
            </div>

            {/* Right Column: Mini Price Trajectory Sparkline & Key Stats */}
            <div className="md:col-span-5 bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/70 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-700" />
                  {t.trajectory}
                </span>
                <span className="text-emerald-800 font-bold font-mono text-xs">+₹7.00/kg ({language === 'mr' ? 'वाढ' : 'Upward'})</span>
              </div>

              {/* SVG Sparkline Graph */}
              <div className="h-28 w-full pt-2">
                <svg viewBox="0 0 280 80" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal gridlines */}
                  <line x1="0" y1="20" x2="280" y2="20" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="280" y2="50" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="75" x2="280" y2="75" stroke="#e7e5e4" strokeWidth="1" />

                  {/* Gradient Area under curve */}
                  <path
                    d="M 10 65 L 50 55 L 90 48 L 135 38 L 180 30 L 225 24 L 270 20 L 270 75 L 10 75 Z"
                    fill="url(#priceGradient)"
                  />

                  {/* Price Path Line */}
                  <path
                    d="M 10 65 L 50 55 L 90 48 L 135 38 L 180 30 L 225 24 L 270 20"
                    fill="none"
                    stroke="#047857"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data points */}
                  {insights.priceHistory.map((item, idx) => {
                    const x = 10 + idx * 43.3;
                    const y = 65 - idx * 7.5;
                    const dayLabel = language === 'mr'
                      ? (item.day === 'Mon' ? 'सोम' : item.day === 'Tue' ? 'मंगळ' : item.day === 'Wed' ? 'बुध' : item.day === 'Thu' ? 'गुरु' : item.day === 'Fri' ? 'शुक्र' : item.day === 'Sat' ? 'शनि' : 'आज')
                      : item.day;

                    return (
                      <g key={idx}>
                        <circle
                          cx={x}
                          cy={y}
                          r={idx === insights.priceHistory.length - 1 ? 4.5 : 3}
                          fill={idx === insights.priceHistory.length - 1 ? '#047857' : '#ffffff'}
                          stroke="#047857"
                          strokeWidth="2"
                        />
                        <text
                          x={x}
                          y={y - 8}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#1c1917"
                          fontWeight="700"
                          className="font-mono"
                        >
                          ₹{item.price}
                        </text>
                        <text
                          x={x}
                          y="78"
                          textAnchor="middle"
                          fontSize="9.5"
                          fill="#57534e"
                          fontWeight="600"
                        >
                          {dayLabel}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="pt-1.5 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200">
                <span>{t.peakWindow}</span>
                <span className="text-emerald-800 font-semibold">{t.recommendedTarget} ₹26.00/kg</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION TITLED "Top Buyer Matches" (उत्तम खरेदीदार सामने) */}
      <section aria-labelledby="top-buyer-matches-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="top-buyer-matches-heading" className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                {t.topBuyerMatches}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {buyerMatches.filter((m) => m.status === 'pending').length} {language === 'mr' ? 'सक्रिय' : 'Active'}
              </span>
            </div>
            <p className="text-xs text-stone-600">
              {t.topBuyerSub}
            </p>
          </div>

          {/* Filter options - Standardized with Market Insights */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
            {(['all', 'nearby', 'highest'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                className={`px-3.5 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg transition-all cursor-pointer inline-flex items-center justify-center ${
                  filterType === type
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                {type === 'all' ? t.allMatches : type === 'nearby' ? t.nearby : t.topPrice}
              </button>
            ))}
          </div>
        </div>

        {/* List of matching buyers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((match) => {
            const isAccepted = match.status === 'accepted';

            return (
              <div
                key={match.id}
                className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between gap-4 ${
                  isAccepted
                    ? 'border-emerald-500 bg-emerald-50/30 shadow-xs'
                    : 'border-stone-200 shadow-sm hover:shadow-md hover:border-emerald-400'
                }`}
              >
                {/* Header Information */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-stone-900">
                          {match.buyerName}
                        </h3>
                        {match.verifiedBuyer && (
                          <span
                            title="Verified Agritech Buyer"
                            className="inline-flex items-center text-emerald-800 text-xs font-medium"
                          >
                            <ShieldCheck className="w-4 h-4 fill-emerald-100 text-emerald-700" />
                          </span>
                        )}
                      </div>
                      {/* Zero-pill: Clean unboxed metadata with typographic separators */}
                      <div className="flex items-center gap-2 text-xs text-stone-600">
                        <span>{match.buyerType}</span>
                        <span aria-hidden="true">·</span>
                        <span>{match.dealCount} {language === 'mr' ? 'पूर्ण सौदे' : 'completed deals'}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-700 font-semibold font-mono tabular-nums">
                          ★ {match.rating}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-stone-600 block">{language === 'mr' ? 'ऑफर दर' : 'Offer Rate'}</span>
                      <span className="text-lg sm:text-xl font-bold font-mono text-emerald-800 tabular-nums">
                        ₹{match.offeredPricePerKg}/kg
                      </span>
                    </div>
                  </div>

                  {/* Primary Requirement Specifier */}
                  <div className="mt-3.5 p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-900">
                      <span className="text-emerald-950">
                        {language === 'mr' ? 'मागणी' : 'Needs'} <strong className="font-mono tabular-nums text-sm">{match.quantityKg}kg</strong> {language === 'mr' ? 'टोमॅटो' : match.cropName}
                      </span>
                      <span className="font-mono tabular-nums text-stone-700">
                        {language === 'mr' ? 'एकूण' : 'Total'}: ₹{match.totalOfferValue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-600 pt-1.5 border-t border-stone-200">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-500" />
                        {match.location} ({match.distanceKm} km {language === 'mr' ? 'अंतर' : 'away'})
                      </span>
                      <span className="flex items-center gap-1 font-medium text-stone-800">
                        <Clock className="w-3.5 h-3.5 text-stone-500" />
                        {match.deliveryType} · {match.urgency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Action: Accept Request / स्वीकारा */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-stone-600">
                    {language === 'mr' ? 'संपर्क' : 'Contact'}: <span className="font-medium text-stone-900">{match.contactPerson}</span>
                  </div>

                  {isAccepted ? (
                    <div className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[42px] bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300">
                      <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                      <span>{t.requestAccepted}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAcceptRequest(match)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[42px] bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
                    >
                      <span>{t.acceptRequest}</span>
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
