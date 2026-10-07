/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MandiTicker } from './components/MandiTicker';
import { FarmerDashboard } from './components/FarmerDashboard';
import { BuyerDashboard } from './components/BuyerDashboard';
import { DealSuccessModal } from './components/DealSuccessModal';
import { PreOrderModal } from './components/PreOrderModal';
import { mockAgricultureApi } from './data/mockApi';
import { MarketInsight, BuyerMatch, SupplyListing, PreOrderPayload, PreOrderConfirmation } from './types/agriculture';
import { Language } from './data/translations';
import { CheckCircle2, Sprout } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'farmer' | 'buyer'>('farmer');
  const [language, setLanguage] = useState<Language>('en');

  // Market Insights State
  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');
  const [currentInsight, setCurrentInsight] = useState<MarketInsight | null>(null);
  const [allInsights, setAllInsights] = useState<Record<string, MarketInsight>>({});

  // Matches & Supply State
  const [buyerMatches, setBuyerMatches] = useState<BuyerMatch[]>([]);
  const [supplies, setSupplies] = useState<SupplyListing[]>([]);
  const [recentOrders, setRecentOrders] = useState<PreOrderConfirmation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals state
  const [activeDealMatch, setActiveDealMatch] = useState<BuyerMatch | null>(null);
  const [activePreOrderSupply, setActivePreOrderSupply] = useState<SupplyListing | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Initial Data Fetch via Mock API (simulating backend call)
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [insight, matches, supplyList] = await Promise.all([
          mockAgricultureApi.getMarketInsights('tomato'),
          mockAgricultureApi.getBuyerMatches(),
          mockAgricultureApi.getLocalSupply(),
        ]);
        setCurrentInsight(insight);
        setBuyerMatches(matches);
        setSupplies(supplyList);
      } catch (error) {
        console.error('Error fetching initial agriculture mock data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Handle Crop Change in Market Insights
  const handleSelectCrop = async (cropId: string) => {
    setSelectedCropId(cropId);
    try {
      const insight = await mockAgricultureApi.getMarketInsights(cropId);
      setCurrentInsight(insight);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Accept Buyer Request in Farmer Dashboard
  const handleAcceptRequest = async (match: BuyerMatch) => {
    try {
      const result = await mockAgricultureApi.acceptBuyerRequest(match.id);
      if (result.success) {
        // Update local state
        setBuyerMatches((prev) =>
          prev.map((m) => (m.id === match.id ? { ...m, status: 'accepted' } : m))
        );
        setActiveDealMatch(result.match);
        const acceptedMsg = language === 'mr'
          ? `${match.buyerName} यांची मागणी स्वीकारली (${match.quantityKg}kg टोमॅटो)!`
          : `Request accepted for ${match.buyerName} (${match.quantityKg}kg ${match.cropName})!`;
        showToast(acceptedMsg);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Submit Pre-Order in Buyer Dashboard
  const handleSendPreOrder = async (payload: PreOrderPayload): Promise<PreOrderConfirmation> => {
    const confirmation = await mockAgricultureApi.sendPreOrder(payload);
    // Refresh supplies and recent orders
    const updatedSupplies = await mockAgricultureApi.getLocalSupply();
    setSupplies(updatedSupplies);
    setRecentOrders((prev) => [confirmation, ...prev]);
    const orderMsg = language === 'mr'
      ? `प्री-ऑर्डर #${confirmation.orderId} यशस्वीरीत्या पाठवली!`
      : `Pre-order #${confirmation.orderId} successfully dispatched!`;
    showToast(orderMsg);
    return confirmation;
  };

  const pendingRequestsCount = buyerMatches.filter((m) => m.status === 'pending').length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Live Mandi Ticker */}
      <MandiTicker
        language={language}
      />

      {/* Top Navigation Bar with View Switcher & Language Toggle */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        pendingRequestsCount={pendingRequestsCount}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 left-3 right-3 sm:left-auto sm:right-4 z-50 max-w-md bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl border border-stone-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold break-words">{toastMessage}</p>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-x-hidden">
        {isLoading && !currentInsight ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-stone-600 font-medium">
              {language === 'mr' ? 'कृषी दृष्टी बाजार नेटवर्कशी जोडत आहे...' : 'Connecting to Krishi Drishti Mandi Grid...'}
            </p>
          </div>
        ) : (
          <div className="transition-all duration-300">
            {currentView === 'farmer' ? (
              currentInsight && (
                <FarmerDashboard
                  insights={currentInsight}
                  allInsights={allInsights}
                  selectedCropId={selectedCropId}
                  onSelectCrop={handleSelectCrop}
                  buyerMatches={buyerMatches}
                  onAcceptRequest={handleAcceptRequest}
                  language={language}
                />
              )
            ) : (
              <BuyerDashboard
                supplies={supplies}
                onOpenPreOrder={(supply) => setActivePreOrderSupply(supply)}
                recentOrders={recentOrders}
                language={language}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {activeDealMatch && (
        <DealSuccessModal
          key={activeDealMatch.id}
          match={activeDealMatch}
          onClose={() => setActiveDealMatch(null)}
          language={language}
        />
      )}

      {activePreOrderSupply && (
        <PreOrderModal
          key={activePreOrderSupply.id}
          supply={activePreOrderSupply}
          onClose={() => setActivePreOrderSupply(null)}
          onSubmit={handleSendPreOrder}
          language={language}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/80 py-6 px-4 sm:px-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-stone-800">Krishi Drishti</span>
            <span>— {language === 'mr' ? 'थेट शेतकरी-खरेदीदार बाजार' : 'Smart Agriculture Direct Market'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-stone-600">
            <span>{language === 'mr' ? 'संगमनेर APMC केंद्र' : 'Sangamner APMC Hub'}</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'mr' ? 'शेतकरी मदत क्रमांक: १८००-१८०-१५५१' : 'Farmer Helpline: 1800-180-1551'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-800 font-semibold">{language === 'mr' ? 'शून्य दलाली' : 'Zero Middleman Commission'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
