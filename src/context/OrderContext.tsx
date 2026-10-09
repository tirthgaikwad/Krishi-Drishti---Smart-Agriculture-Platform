import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PendingPreOrder, SupplyListing, FulfillmentMethod } from '../types/agriculture';

interface OrderContextType {
  pendingOrders: PendingPreOrder[];
  sentSupplyIds: string[];
  sendPreOrder: (
    supply: SupplyListing,
    customQty?: number,
    fulfillmentMethod?: FulfillmentMethod,
    customTotalAmount?: number,
    deliveryFee?: number
  ) => PendingPreOrder;
  acceptPreOrder: (orderId: string) => PendingPreOrder | undefined;
  rejectPreOrder: (orderId: string) => void;
  resetPrototypeOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // In-memory shared state for prototype order loop
  const [pendingOrders, setPendingOrders] = useState<PendingPreOrder[]>([]);
  const [sentSupplyIds, setSentSupplyIds] = useState<string[]>([]);

  // Buyer Action (Kunal Deshmukh sends a pre-order)
  const sendPreOrder = (
    supply: SupplyListing,
    customQty?: number,
    fulfillmentMethod: FulfillmentMethod = 'Farmgate Pickup',
    customTotalAmount?: number,
    deliveryFee?: number
  ): PendingPreOrder => {
    const qty = customQty && customQty > 0 ? customQty : (supply.availableKg >= 100 ? 100 : supply.availableKg);
    const price = supply.expectedPricePerKg;
    const token = '#KD-8821';
    const subtotal = Math.round(qty * price);
    const fee = deliveryFee !== undefined ? deliveryFee : (fulfillmentMethod === 'Farmer Delivery' ? 45 : 0);
    const total = customTotalAmount !== undefined ? customTotalAmount : (subtotal + fee);

    const newOrder: PendingPreOrder = {
      id: `order-kd-${Date.now()}`,
      orderToken: token,
      buyerName: 'Kunal Deshmukh',
      buyerType: 'Verified Buyer',
      buyerContact: '+91 98220 44101',
      farmerName: supply.farmerName,
      cropName: supply.cropName,
      cropHindi: supply.cropHindi || 'टोमॅटो',
      quantityKg: qty,
      offeredPricePerKg: price,
      produceSubtotal: subtotal,
      deliveryFee: fee,
      totalAmount: total,
      location: supply.location,
      deliveryPreference: fulfillmentMethod,
      fulfillmentMethod: fulfillmentMethod,
      pickupDate: 'Tomorrow, 8:00 AM',
      notes: `${qty}kg order · ${fulfillmentMethod} · Total: ₹${total}`,
      status: 'pending',
      createdAt: 'Just now',
      supplyId: supply.id,
    };

    setPendingOrders((prev) => [newOrder, ...prev.filter((o) => o.supplyId !== supply.id)]);
    setSentSupplyIds((prev) => (prev.includes(supply.id) ? prev : [...prev, supply.id]));

    return newOrder;
  };

  // Farmer Action (Ramesh accepts pre-order)
  const acceptPreOrder = (orderId: string): PendingPreOrder | undefined => {
    let accepted: PendingPreOrder | undefined;
    setPendingOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          accepted = { ...order, status: 'accepted' };
          return accepted;
        }
        return order;
      })
    );
    return accepted;
  };

  // Farmer Action (Ramesh rejects pre-order)
  const rejectPreOrder = (orderId: string) => {
    setPendingOrders((prev) => {
      const target = prev.find((o) => o.id === orderId);
      if (target) {
        // Also allow buyer to re-send if desired
        setSentSupplyIds((sIds) => sIds.filter((id) => id !== target.supplyId));
      }
      return prev.filter((order) => order.id !== orderId);
    });
  };

  const resetPrototypeOrders = () => {
    setPendingOrders([]);
    setSentSupplyIds([]);
  };

  return (
    <OrderContext.Provider
      value={{
        pendingOrders,
        sentSupplyIds,
        sendPreOrder,
        acceptPreOrder,
        rejectPreOrder,
        resetPrototypeOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};
