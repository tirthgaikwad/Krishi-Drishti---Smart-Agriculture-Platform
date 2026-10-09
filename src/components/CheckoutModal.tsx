import React, { useState, useEffect } from 'react';
import { SupplyListing, PreOrderPayload, PreOrderConfirmation, FulfillmentMethod } from '../types/agriculture';
import { Language, translations } from '../data/translations';
import { X, ShoppingCart, Calculator, MapPin, ShieldCheck, Check, Truck, Store, Info } from 'lucide-react';

interface CheckoutModalProps {
  supply: SupplyListing | null;
  onClose: () => void;
  onConfirm: (payload: PreOrderPayload) => Promise<PreOrderConfirmation>;
  language?: Language;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  supply,
  onClose,
  onConfirm,
  language = 'en',
}) => {
  if (!supply) return null;
  const t = translations[language];

  // Default quantity to 1 as per requirements
  const [quantity, setQuantity] = useState<number>(1);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('Farmgate Pickup');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const baseRate = supply.expectedPricePerKg;

  // Mock distance and delivery charge logic
  const mockDistanceKm = 15;
  const deliveryRatePerKm = 3;
  const deliveryFee = fulfillmentMethod === 'Farmer Delivery' ? mockDistanceKm * deliveryRatePerKm : 0;

  // Dynamic price calculation
  const produceSubtotal = Math.max(0, Math.round((quantity || 0) * baseRate));
  const finalTotal = produceSubtotal + deliveryFee;

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setQuantity(0);
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setQuantity(Math.max(1, Math.min(supply.availableKg, num)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    setIsSubmitting(true);
    try {
      await onConfirm({
        supplyId: supply.id,
        buyerName: 'Kunal Deshmukh',
        buyerContact: '+91 98220 44101',
        quantityKg: quantity,
        offeredPricePerKg: baseRate,
        fulfillmentMethod: fulfillmentMethod,
        deliveryPreference: fulfillmentMethod,
        deliveryFee: deliveryFee,
        totalAmount: finalTotal,
        pickupDate: 'Tomorrow, 8:00 AM',
        notes: `${quantity}kg · ${fulfillmentMethod} · Subtotal: ₹${produceSubtotal} + Delivery: ₹${deliveryFee} = Final: ₹${finalTotal}`,
      });
      onClose();
    } catch (err) {
      console.error('Error confirming order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cropTitle = language === 'mr' ? (supply.cropHindi || supply.cropName) : supply.cropName;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="bg-emerald-800 text-white p-4 sm:p-5 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-white shrink-0">
              <ShoppingCart className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-emerald-200 text-xs font-semibold block">
                {language === 'mr' ? 'थेट शेतकरी प्री-ऑर्डर' : 'Direct Farmer Sourcing'}
              </span>
              <h2 id="checkout-modal-title" className="text-base sm:text-lg font-bold text-white break-words">
                {language === 'mr' ? 'खरेदी चेकआउट' : 'Pre-Order Checkout'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-emerald-900/70 hover:bg-emerald-900 border border-emerald-600/50 flex items-center justify-center text-white hover:text-emerald-100 transition-all cursor-pointer shrink-0 shadow-xs"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body with Dynamic Calculator & Fulfillment Selector */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Crop & Base Rate Info */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-stone-900">
                  {cropTitle}
                </span>
                <span className="text-stone-500 text-xs">({supply.farmerName})</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{supply.location} · {supply.variety}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-stone-500 block text-[11px]">
                {language === 'mr' ? 'मूळ दर' : 'Base Rate'}
              </span>
              <span className="text-base font-bold font-mono text-emerald-800 tabular-nums">
                ₹{baseRate}/kg
              </span>
            </div>
          </div>

          {/* 1. Dynamic Quantity Calculator Input */}
          <div className="space-y-2 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200/80">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="checkout-qty-input" className="font-bold text-stone-800 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-700" />
                <span>{language === 'mr' ? 'प्रमाण प्रविष्ट करा (किलो मध्ये)' : 'Enter Quantity (in kg)'}</span>
              </label>
              <span className="text-stone-500 font-medium text-xs">
                {language === 'mr' ? 'उपलब्ध:' : 'Max:'} <strong className="font-mono text-stone-800">{supply.availableKg} kg</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="checkout-qty-input"
                name="quantity"
                type="number"
                min="1"
                max={supply.availableKg}
                value={quantity === 0 ? '' : quantity}
                onChange={handleQuantityInputChange}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-base font-mono tabular-nums font-bold text-stone-900 focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                placeholder="1"
                required
              />
              <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-2.5 rounded-xl border border-stone-200">
                kg
              </span>
            </div>

            {/* Quick Quantity Presets */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              {[1, 10, 25, 50, 100].filter(q => q <= supply.availableKg).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuantity(q)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    quantity === q
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {q} kg
                </button>
              ))}
            </div>
          </div>

          {/* 2. Interactive Fulfillment Method Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>{t.fulfillmentMethod}</span>
              </label>
              <span className="text-[11px] text-stone-500">
                {language === 'mr' ? 'अंतर: १५ किमी' : 'Distance: 15 km'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-label={t.fulfillmentMethod}>
              {/* Option A: Farmgate Pickup */}
              <button
                type="button"
                role="radio"
                aria-checked={fulfillmentMethod === 'Farmgate Pickup'}
                onClick={() => setFulfillmentMethod('Farmgate Pickup')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  fulfillmentMethod === 'Farmgate Pickup'
                    ? 'border-2 border-emerald-700 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-700/20'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Store className={`w-4 h-4 ${fulfillmentMethod === 'Farmgate Pickup' ? 'text-emerald-700' : 'text-stone-500'}`} />
                    <span className="text-xs font-bold text-stone-900">
                      {t.farmgatePickup}
                    </span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    fulfillmentMethod === 'Farmgate Pickup'
                      ? 'border-emerald-700 bg-emerald-700'
                      : 'border-stone-300 bg-white'
                  }`}>
                    {fulfillmentMethod === 'Farmgate Pickup' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-stone-500 leading-tight">
                    {t.farmgatePickupSub}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                      {t.freeDelivery}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">₹0</span>
                  </div>
                </div>
              </button>

              {/* Option B: Farmer Delivery */}
              <button
                type="button"
                role="radio"
                aria-checked={fulfillmentMethod === 'Farmer Delivery'}
                onClick={() => setFulfillmentMethod('Farmer Delivery')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  fulfillmentMethod === 'Farmer Delivery'
                    ? 'border-2 border-emerald-700 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-700/20'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Truck className={`w-4 h-4 ${fulfillmentMethod === 'Farmer Delivery' ? 'text-emerald-700' : 'text-stone-500'}`} />
                    <span className="text-xs font-bold text-stone-900">
                      {t.farmerDelivery}
                    </span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    fulfillmentMethod === 'Farmer Delivery'
                      ? 'border-emerald-700 bg-emerald-700'
                      : 'border-stone-300 bg-white'
                  }`}>
                    {fulfillmentMethod === 'Farmer Delivery' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-stone-500 leading-tight">
                    {t.farmerDeliverySub}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded">
                      {t.deliveryCalculation}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-900">+₹45</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Updated Price Calculator with Math Breakdown */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
            {/* Math Formula Display */}
            <div className="flex items-center justify-between text-xs text-stone-600 pb-2 border-b border-stone-200">
              <span className="flex items-center gap-1 font-medium">
                <Info className="w-3.5 h-3.5 text-stone-400" />
                <span>{language === 'mr' ? 'हिशोब तपशील:' : 'Calculation Formula:'}</span>
              </span>
              <span className="font-mono text-[11px] text-stone-800 font-semibold bg-white px-2 py-0.5 rounded border border-stone-200">
                ({quantity || 0}kg × ₹{baseRate}) + ₹{deliveryFee} = ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Line items */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span>
                  {t.produceSubtotal} ({quantity || 0} kg × ₹{baseRate}/kg)
                </span>
                <span className="font-mono font-semibold text-stone-800">
                  ₹{produceSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  <span>{t.deliveryCharge}</span>
                  <span className="text-[11px] text-stone-500">
                    ({fulfillmentMethod === 'Farmer Delivery' ? (language === 'mr' ? '१५ किमी × ₹३' : '15 km × ₹3') : t.freeDelivery})
                  </span>
                </span>
                <span className={`font-mono font-semibold ${deliveryFee > 0 ? 'text-amber-800' : 'text-emerald-700'}`}>
                  {deliveryFee > 0 ? `+₹${deliveryFee}` : '₹0'}
                </span>
              </div>
            </div>

            {/* Final Total Banner */}
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 block">
                  {t.finalTotal}
                </span>
                <span className="text-[11px] text-stone-500">
                  {language === 'mr' ? 'सर्व शुल्कांसह अंतिम रक्कम' : 'Inclusive of produce & delivery'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-900 tabular-nums">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Buyer Preview */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-600">{language === 'mr' ? 'खरेदीदार:' : 'Buyer:'}</span>
              <span className="font-semibold text-stone-900 flex items-center gap-1">
                Kunal Deshmukh <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600">{language === 'mr' ? 'निवडलेली पद्धत:' : 'Fulfillment:'}</span>
              <span className="font-medium text-stone-800">
                {fulfillmentMethod === 'Farmer Delivery'
                  ? (language === 'mr' ? 'शेतकरी वितरण (+₹४५)' : 'Farmer Delivery (+₹45)')
                  : (language === 'mr' ? 'शेत बांधावर उचल (मोफत)' : 'Farmgate Pickup (Free)')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[42px] border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-stone-500" />
              <span>{t.cancel}</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting || quantity <= 0}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[42px] bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>
                {isSubmitting
                  ? (language === 'mr' ? 'पाठवत आहे...' : 'Sending...')
                  : (language === 'mr' ? 'मागणी निश्चित करा' : 'Confirm Request')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
