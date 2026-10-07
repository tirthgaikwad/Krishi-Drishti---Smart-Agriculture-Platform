import React, { useState, useEffect } from 'react';
import { SupplyListing, PreOrderPayload, PreOrderConfirmation } from '../types/agriculture';
import { Language, translations } from '../data/translations';
import { X, CheckCircle2, Calendar, MapPin, Truck, AlertCircle, ShoppingCart } from 'lucide-react';

interface PreOrderModalProps {
  supply: SupplyListing | null;
  onClose: () => void;
  onSubmit: (payload: PreOrderPayload) => Promise<PreOrderConfirmation>;
  language?: Language;
}

export const PreOrderModal: React.FC<PreOrderModalProps> = ({ supply, onClose, onSubmit, language = 'en' }) => {
  if (!supply) return null;
  const t = translations[language];

  const [quantity, setQuantity] = useState<number>(Math.min(50, supply.availableKg));
  const [deliveryPref, setDeliveryPref] = useState<'pickup' | 'delivery'>('pickup');
  const [pickupDate, setPickupDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('Please keep ripe, firm grade sorted in crates.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<PreOrderConfirmation | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const pricePerKg = supply.expectedPricePerKg;
  const totalPrice = Math.round(quantity * pricePerKg);

  const handleQuantityChange = (val: number) => {
    if (isNaN(val)) return;
    const clamped = Math.max(1, Math.min(supply.availableKg, val));
    setQuantity(clamped);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0 || quantity > supply.availableKg) return;

    setIsSubmitting(true);
    try {
      const order = await onSubmit({
        supplyId: supply.id,
        buyerName: 'ABC Restaurant / Kunal Deshmukh',
        buyerContact: '+91 98220 44101',
        quantityKg: quantity,
        offeredPricePerKg: pricePerKg,
        deliveryPreference: deliveryPref,
        pickupDate: pickupDate,
        notes: notes,
      });
      setConfirmedOrder(order);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preorder-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header - Fixed & Pinned */}
        <div className="bg-emerald-800 text-white p-4 sm:p-5 flex items-start justify-between shrink-0">
          <div>
            <span className="text-emerald-200 text-xs font-semibold tracking-wide uppercase">
              {language === 'mr' ? 'थेट शेतकरी खरेदी' : 'Direct Farmer Sourcing'}
            </span>
            <h2 id="preorder-modal-title" className="text-base sm:text-lg font-bold text-white break-words">
              {language === 'mr' ? 'प्री-ऑर्डर पाठवा: ' : 'Send Pre-order to '} {supply.farmerName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close pre-order modal"
            title="Close modal"
            className="w-9 h-9 rounded-full bg-emerald-900/70 hover:bg-emerald-900 border border-emerald-600/50 flex items-center justify-center text-white hover:text-emerald-100 transition-all cursor-pointer shrink-0 shadow-xs ml-2"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
            <div className="text-center py-3 sm:py-4 space-y-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                {language === 'mr' ? 'प्री-ऑर्डर पाठवली!' : 'Pre-order Dispatched!'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                {language === 'mr' ? 'ऑर्डर ' : 'Order '}
                <span className="font-mono font-semibold text-emerald-800">#{confirmedOrder.orderId}</span>
                {language === 'mr' ? ' शेतकरी ' : ' has been sent to farmer '}
                <span className="font-semibold text-stone-900">{supply.farmerName}</span>
                {language === 'mr' ? ' यांच्याकडे पाठवली आहे.' : '.'}
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 sm:p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">{language === 'mr' ? 'राखीव शेतमाल:' : 'Reserved Produce:'}</span>
                <span className="font-semibold text-stone-900 font-mono tabular-nums">
                  {confirmedOrder.quantityKg} kg {language === 'mr' ? supply.cropHindi : supply.cropName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{language === 'mr' ? 'भाव दर:' : 'Price Rate:'}</span>
                <span className="font-semibold text-stone-900 font-mono tabular-nums">
                  ₹{supply.expectedPricePerKg}/kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{language === 'mr' ? 'नियोजित तारीख:' : 'Scheduled Date:'}</span>
                <span className="font-semibold text-stone-900">{confirmedOrder.pickupDate}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 text-sm font-bold">
                <span className="text-stone-700">{language === 'mr' ? 'एकूण रक्कम:' : 'Total Amount:'}</span>
                <span className="text-emerald-800 font-mono tabular-nums">
                  ₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                {language === 'mr' ? 'पूर्ण' : 'Done'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Form Top Bar with Cross Button */}
            <div className="flex items-center justify-between pb-1 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                {t.preOrderDetails}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close pre-order form"
                title="Close"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors text-xs font-medium cursor-pointer"
              >
                <X className="w-4 h-4 text-stone-600" />
                <span className="text-[11px]">{language === 'mr' ? 'बंद करा' : 'Close'}</span>
              </button>
            </div>

            {/* Supply Summary Card */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-sm text-stone-900">
                  {supply.cropName} ({supply.variety})
                </p>
                <div className="flex items-center gap-2 text-stone-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {supply.location} · {supply.farmName}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-stone-500 block text-[11px]">Expected Rate</span>
                <span className="text-base font-bold font-mono text-emerald-800 tabular-nums">
                  ₹{pricePerKg}/kg
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="quantity-input" className="font-bold text-stone-700">
                  Order Quantity (kg)
                </label>
                <span className="text-stone-500">
                  Max available: <strong className="font-mono tabular-nums">{supply.availableKg} kg</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="quantity-input"
                  type="range"
                  min="1"
                  max={supply.availableKg}
                  step="1"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <div className="relative w-24 shrink-0">
                  <input
                    type="number"
                    min="1"
                    max={supply.availableKg}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-sm font-mono tabular-nums font-bold text-stone-900 text-right focus:outline-emerald-600"
                  />
                  <span className="absolute right-7 top-2 text-[11px] text-stone-400 font-medium pointer-events-none">
                    kg
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Option */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">Fulfillment Method</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryPref('pickup')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    deliveryPref === 'pickup'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-stone-900">Farmgate Pickup</p>
                    <p className="text-[11px] text-stone-500">Buyer brings crates</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryPref('delivery')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    deliveryPref === 'delivery'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Truck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-stone-900">Farmer Delivery</p>
                    <p className="text-[11px] text-stone-500">Drop at your kitchen</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-1.5">
              <label htmlFor="pickup-date" className="block text-xs font-bold text-stone-700">
                Required Delivery / Pickup Date
              </label>
              <div className="relative">
                <input
                  id="pickup-date"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-emerald-600"
                />
              </div>
            </div>

            {/* Special Notes */}
            <div className="space-y-1.5">
              <label htmlFor="order-notes" className="block text-xs font-bold text-stone-700">
                Instructions / Quality Request (Optional)
              </label>
              <input
                id="order-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Medium size, firm skin, harvest morning batch"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-emerald-600"
              />
            </div>

            {/* Total Estimated Cost Banner */}
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[11px] text-emerald-800 font-semibold uppercase">Estimated Total</p>
                <p className="text-xs text-stone-500">
                  {quantity} kg × ₹{pricePerKg}/kg
                </p>
              </div>
              <p className="text-xl font-bold font-mono text-emerald-900 tabular-nums">
                ₹{totalPrice.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-300 text-stone-600 hover:bg-stone-50 hover:text-stone-900 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-stone-500" />
                <span>{t.cancel}</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting || quantity <= 0}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isSubmitting ? (language === 'mr' ? 'पाठवत आहे...' : 'Sending Request...') : t.confirmSendPreOrder}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
