export interface MarketInsight {
  cropId: string;
  cropName: string;
  cropHindi: string;
  trend: 'Increasing' | 'Stable' | 'Decreasing';
  trendIcon: string;
  demand: 'High' | 'Moderate' | 'Low';
  demandColor: string;
  expectedPriceMin: number;
  expectedPriceMax: number;
  unit: string;
  mandiLocation: string;
  priceHistory: { day: string; price: number }[];
  marketAdvice: string;
  volumeArrivalsToday: string;
  projectedPeakDays: number;
}

export interface BuyerMatch {
  id: string;
  buyerName: string;
  buyerType: 'Restaurant' | 'Supermarket' | 'Wholesaler' | 'Food Processing';
  cropName: string;
  quantityKg: number;
  location: string;
  distanceKm: number;
  offeredPricePerKg: number;
  totalOfferValue: number;
  deliveryType: 'Buyer Pickup' | 'Farmgate Collection' | 'APMC Drop';
  urgency: 'Immediate' | 'Within 24 hrs' | 'This Weekend';
  status: 'pending' | 'accepted' | 'declined';
  rating: number;
  dealCount: number;
  verifiedBuyer: boolean;
  contactPerson: string;
  phone: string;
}

export interface SupplyListing {
  id: string;
  farmerName: string;
  farmerPhone: string;
  cropName: string;
  cropHindi: string;
  variety: string;
  availableKg: number;
  location: string;
  distanceKm: number;
  expectedPricePerKg: number;
  grade: 'Grade A' | 'Premium Export' | 'Standard Market';
  harvestStatus: 'Harvested Today' | 'Harvested Yesterday' | 'Ready for Harvest';
  organicCertified: boolean;
  farmName: string;
  imageUrl?: string;
}

export type FulfillmentMethod = 'Farmgate Pickup' | 'Farmer Delivery';

export interface PreOrderPayload {
  supplyId: string;
  buyerName: string;
  buyerContact: string;
  quantityKg: number;
  offeredPricePerKg: number;
  deliveryPreference: 'pickup' | 'delivery' | FulfillmentMethod;
  fulfillmentMethod?: FulfillmentMethod;
  deliveryFee?: number;
  totalAmount?: number;
  pickupDate: string;
  notes?: string;
}

export interface PreOrderConfirmation {
  orderId: string;
  supply: SupplyListing;
  quantityKg: number;
  totalAmount: number;
  deliveryFee?: number;
  fulfillmentMethod?: FulfillmentMethod;
  pickupDate: string;
  deliveryPreference: 'pickup' | 'delivery' | FulfillmentMethod;
  status: 'Confirmed' | 'Pending Confirmation';
  createdAt: string;
}

export interface PendingPreOrder {
  id: string;
  orderToken: string; // e.g. '#KD-8821'
  buyerName: string; // 'Kunal Deshmukh'
  buyerType: string; // 'Verified Buyer'
  buyerContact: string; // '+91 98220 44101'
  farmerName: string; // 'Ramesh Patil'
  cropName: string; // 'Tomato'
  cropHindi: string; // 'टोमॅटो'
  quantityKg: number;
  offeredPricePerKg: number;
  totalAmount: number;
  produceSubtotal?: number;
  deliveryFee?: number;
  location: string;
  deliveryPreference: 'Farmgate Pickup' | 'Farmer Delivery' | 'pickup' | 'delivery' | string;
  fulfillmentMethod?: FulfillmentMethod;
  pickupDate: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  supplyId: string;
}
