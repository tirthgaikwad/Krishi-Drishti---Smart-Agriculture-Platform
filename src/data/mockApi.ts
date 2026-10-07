import { MarketInsight, BuyerMatch, SupplyListing, PreOrderPayload, PreOrderConfirmation } from '../types/agriculture';

// Initial Mock JSON Data Store (Simulating Backend Database)
const INITIAL_MARKET_INSIGHTS: Record<string, MarketInsight> = {
  tomato: {
    cropId: 'tomato',
    cropName: 'Tomato',
    cropHindi: 'टोमॅटो (Tomato)',
    trend: 'Increasing',
    trendIcon: '📈',
    demand: 'High',
    demandColor: 'emerald',
    expectedPriceMin: 24,
    expectedPriceMax: 26,
    unit: 'kg',
    mandiLocation: 'Sangamner APMC',
    priceHistory: [
      { day: 'Mon', price: 19 },
      { day: 'Tue', price: 21 },
      { day: 'Wed', price: 22 },
      { day: 'Thu', price: 24 },
      { day: 'Fri', price: 25 },
      { day: 'Sat', price: 26 },
      { day: 'Today', price: 26 },
    ],
    marketAdvice: 'Strong procurement drive by regional restaurants & Pune transport. Selling within next 24-48 hours is recommended for top margins.',
    volumeArrivalsToday: '420 Quintals (Down 14%)',
    projectedPeakDays: 2,
  },
  onion: {
    cropId: 'onion',
    cropName: 'Red Onion',
    cropHindi: 'कांदा (Onion)',
    trend: 'Increasing',
    trendIcon: '📈',
    demand: 'High',
    demandColor: 'emerald',
    expectedPriceMin: 32,
    expectedPriceMax: 36,
    unit: 'kg',
    mandiLocation: 'Lasalgaon / Rahuri APMC',
    priceHistory: [
      { day: 'Mon', price: 27 },
      { day: 'Tue', price: 28 },
      { day: 'Wed', price: 30 },
      { day: 'Thu', price: 32 },
      { day: 'Fri', price: 34 },
      { day: 'Sat', price: 35 },
      { day: 'Today', price: 35 },
    ],
    marketAdvice: 'Nashik Garwa variety in high demand across Mumbai wholesale corridor. Stable upward momentum.',
    volumeArrivalsToday: '850 Quintals',
    projectedPeakDays: 5,
  },
  chilli: {
    cropId: 'chilli',
    cropName: 'Green Chilli',
    cropHindi: 'हिरवी मिरची (Green Chilli)',
    trend: 'Stable',
    trendIcon: '➡️',
    demand: 'Moderate',
    demandColor: 'amber',
    expectedPriceMin: 42,
    expectedPriceMax: 46,
    unit: 'kg',
    mandiLocation: 'Kopargaon Sub-Mandi',
    priceHistory: [
      { day: 'Mon', price: 44 },
      { day: 'Tue', price: 43 },
      { day: 'Wed', price: 45 },
      { day: 'Thu', price: 44 },
      { day: 'Fri', price: 45 },
      { day: 'Sat', price: 44 },
      { day: 'Today', price: 45 },
    ],
    marketAdvice: 'Steady hotel and spice processor intake. Keep sorting quality Grade A to preserve premium.',
    volumeArrivalsToday: '180 Quintals',
    projectedPeakDays: 7,
  },
  pomegranate: {
    cropId: 'pomegranate',
    cropName: 'Pomegranate (Bhagwa)',
    cropHindi: 'डाळिंब (Bhagwa)',
    trend: 'Increasing',
    trendIcon: '📈',
    demand: 'High',
    demandColor: 'emerald',
    expectedPriceMin: 105,
    expectedPriceMax: 120,
    unit: 'kg',
    mandiLocation: 'Sangamner Fruit Yard',
    priceHistory: [
      { day: 'Mon', price: 98 },
      { day: 'Tue', price: 102 },
      { day: 'Wed', price: 106 },
      { day: 'Thu', price: 110 },
      { day: 'Fri', price: 112 },
      { day: 'Sat', price: 116 },
      { day: 'Today', price: 118 },
    ],
    marketAdvice: 'High export buyers scouring for uniform color Bhagwa batches. Direct pre-booking prices at record seasonal peak.',
    volumeArrivalsToday: '260 Quintals',
    projectedPeakDays: 4,
  },
};

const INITIAL_BUYER_MATCHES: BuyerMatch[] = [
  {
    id: 'req-001',
    buyerName: 'ABC Restaurant',
    buyerType: 'Restaurant',
    cropName: 'Tomato',
    quantityKg: 100,
    location: 'Sangamner',
    distanceKm: 3.2,
    offeredPricePerKg: 26,
    totalOfferValue: 2600,
    deliveryType: 'Buyer Pickup',
    urgency: 'Within 24 hrs',
    status: 'pending',
    rating: 4.9,
    dealCount: 42,
    verifiedBuyer: true,
    contactPerson: 'Kunal Deshmukh (Procurement Lead)',
    phone: '+91 98220 44101',
  },
  {
    id: 'req-002',
    buyerName: 'Kisan Fresh Mart',
    buyerType: 'Supermarket',
    cropName: 'Tomato',
    quantityKg: 250,
    location: 'Nashik Road',
    distanceKm: 18.5,
    offeredPricePerKg: 25.5,
    totalOfferValue: 6375,
    deliveryType: 'Farmgate Collection',
    urgency: 'Immediate',
    status: 'pending',
    rating: 4.8,
    dealCount: 118,
    verifiedBuyer: true,
    contactPerson: 'Sanjay Thorat',
    phone: '+91 94231 88922',
  },
  {
    id: 'req-003',
    buyerName: 'Sahyadri Agro Hub',
    buyerType: 'Wholesaler',
    cropName: 'Tomato',
    quantityKg: 500,
    location: 'Pune Bypass Hub',
    distanceKm: 34.0,
    offeredPricePerKg: 25.0,
    totalOfferValue: 12500,
    deliveryType: 'APMC Drop',
    urgency: 'This Weekend',
    status: 'pending',
    rating: 4.7,
    dealCount: 204,
    verifiedBuyer: true,
    contactPerson: 'Pravin Vikhe',
    phone: '+91 99701 55210',
  },
  {
    id: 'req-004',
    buyerName: 'Hotel Panchavati & Caterers',
    buyerType: 'Restaurant',
    cropName: 'Tomato',
    quantityKg: 60,
    location: 'Sangamner City',
    distanceKm: 1.8,
    offeredPricePerKg: 26.5,
    totalOfferValue: 1590,
    deliveryType: 'Buyer Pickup',
    urgency: 'Immediate',
    status: 'pending',
    rating: 5.0,
    dealCount: 19,
    verifiedBuyer: true,
    contactPerson: 'Mahesh Borse',
    phone: '+91 98500 12389',
  },
];

const INITIAL_SUPPLY_LISTINGS: SupplyListing[] = [
  {
    id: 'sup-001',
    farmerName: 'Ramesh Patil',
    farmerPhone: '+91 98229 11029',
    cropName: 'Tomato',
    cropHindi: 'टोमॅटो',
    variety: 'Abhinav Hybrid (Deep Red, Firm Skin)',
    availableKg: 150,
    location: 'Sangamner',
    distanceKm: 2.4,
    expectedPricePerKg: 25,
    grade: 'Grade A',
    harvestStatus: 'Harvested Today',
    organicCertified: true,
    farmName: 'Patil Agro Farm',
  },
  {
    id: 'sup-002',
    farmerName: 'Sunil Shinde',
    farmerPhone: '+91 97654 33210',
    cropName: 'Red Onion',
    cropHindi: 'कांदा',
    variety: 'Nashik Garwa (Long Shelf Life)',
    availableKg: 300,
    location: 'Rahuri',
    distanceKm: 14.2,
    expectedPricePerKg: 34,
    grade: 'Grade A',
    harvestStatus: 'Harvested Yesterday',
    organicCertified: false,
    farmName: 'Shinde Krishi Kendra',
  },
  {
    id: 'sup-003',
    farmerName: 'Anand Jadhav',
    farmerPhone: '+91 94212 90877',
    cropName: 'Green Chilli',
    cropHindi: 'हिरवी मिरची',
    variety: 'G4 Teja (Dark Green, Crisp)',
    availableKg: 80,
    location: 'Kopargaon',
    distanceKm: 18.0,
    expectedPricePerKg: 45,
    grade: 'Grade A',
    harvestStatus: 'Harvested Today',
    organicCertified: false,
    farmName: 'Jadhav Organic Acres',
  },
  {
    id: 'sup-004',
    farmerName: 'Suresh Kale',
    farmerPhone: '+91 98901 44521',
    cropName: 'Pomegranate',
    cropHindi: 'डाळिंब',
    variety: 'Bhagwa Red Arils (Brix 16+)',
    availableKg: 500,
    location: 'Sangamner',
    distanceKm: 5.6,
    expectedPricePerKg: 110,
    grade: 'Premium Export',
    harvestStatus: 'Ready for Harvest',
    organicCertified: true,
    farmName: 'Kale Orchards Sangamner',
  },
  {
    id: 'sup-005',
    farmerName: 'Dnyaneshwar Gaikwad',
    farmerPhone: '+91 98811 77209',
    cropName: 'Fresh Ginger',
    cropHindi: 'आले (Ginger)',
    variety: 'Mahim Ginger (Bold Fibrous Rhizomes)',
    availableKg: 200,
    location: 'Akole',
    distanceKm: 11.8,
    expectedPricePerKg: 75,
    grade: 'Grade A',
    harvestStatus: 'Harvested Yesterday',
    organicCertified: true,
    farmName: 'Sahyadri Foothills Farm',
  },
  {
    id: 'sup-006',
    farmerName: 'Balasaheb Dighe',
    farmerPhone: '+91 99220 88143',
    cropName: 'Tomato',
    cropHindi: 'टोमॅटो',
    variety: 'Saaho 3251 (Salad Quality)',
    availableKg: 220,
    location: 'Sangamner',
    distanceKm: 4.1,
    expectedPricePerKg: 24.5,
    grade: 'Standard Market',
    harvestStatus: 'Harvested Today',
    organicCertified: false,
    farmName: 'Dighe Farm Talegaon',
  },
];

// In-Memory mutable storage for current session
let currentMatches: BuyerMatch[] = [...INITIAL_BUYER_MATCHES];
let currentSupply: SupplyListing[] = [...INITIAL_SUPPLY_LISTINGS];
const preOrderRecords: PreOrderConfirmation[] = [];

/**
 * Mock API service simulating asynchronous backend calls
 */
export const mockAgricultureApi = {
  // Fetch market insights for a specific crop
  async getMarketInsights(cropId: string = 'tomato'): Promise<MarketInsight> {
    await new Promise((res) => setTimeout(res, 120));
    return INITIAL_MARKET_INSIGHTS[cropId] || INITIAL_MARKET_INSIGHTS['tomato'];
  },

  // Get buyer matches for farmer Ramesh
  async getBuyerMatches(): Promise<BuyerMatch[]> {
    await new Promise((res) => setTimeout(res, 150));
    return [...currentMatches];
  },

  // Accept a buyer request (farmer action)
  async acceptBuyerRequest(requestId: string): Promise<{ success: boolean; match: BuyerMatch; message: string }> {
    await new Promise((res) => setTimeout(res, 300));
    const targetIndex = currentMatches.findIndex((m) => m.id === requestId);
    if (targetIndex === -1) {
      throw new Error('Buyer match request not found');
    }
    currentMatches[targetIndex] = {
      ...currentMatches[targetIndex],
      status: 'accepted',
    };
    return {
      success: true,
      match: currentMatches[targetIndex],
      message: `Successfully accepted request from ${currentMatches[targetIndex].buyerName}! Pickup token generated.`,
    };
  },

  // Decline a buyer request
  async declineBuyerRequest(requestId: string): Promise<{ success: boolean }> {
    await new Promise((res) => setTimeout(res, 150));
    currentMatches = currentMatches.map((m) => (m.id === requestId ? { ...m, status: 'declined' } : m));
    return { success: true };
  },

  // Get local produce supply with search & filter options
  async getLocalSupply(params?: {
    query?: string;
    cropFilter?: string;
    locationFilter?: string;
  }): Promise<SupplyListing[]> {
    await new Promise((res) => setTimeout(res, 180));
    let results = [...currentSupply];

    if (params?.query && params.query.trim().length > 0) {
      const q = params.query.toLowerCase().trim();
      results = results.filter(
        (item) =>
          item.cropName.toLowerCase().includes(q) ||
          item.farmerName.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.variety.toLowerCase().includes(q) ||
          item.farmName.toLowerCase().includes(q)
      );
    }

    if (params?.cropFilter && params.cropFilter !== 'All') {
      const crop = params.cropFilter.toLowerCase();
      results = results.filter((item) => item.cropName.toLowerCase().includes(crop));
    }

    if (params?.locationFilter && params.locationFilter !== 'All') {
      results = results.filter((item) => item.location.toLowerCase() === params.locationFilter?.toLowerCase());
    }

    return results;
  },

  // Submit a buyer pre-order
  async sendPreOrder(payload: PreOrderPayload): Promise<PreOrderConfirmation> {
    await new Promise((res) => setTimeout(res, 350));
    const supply = currentSupply.find((s) => s.id === payload.supplyId);
    if (!supply) {
      throw new Error('Selected farmer produce supply not found');
    }

    const orderId = `PO-${Math.floor(100000 + Math.random() * 900000)}`;
    const confirmation: PreOrderConfirmation = {
      orderId,
      supply,
      quantityKg: payload.quantityKg,
      totalAmount: Math.round(payload.quantityKg * payload.offeredPricePerKg),
      pickupDate: payload.pickupDate,
      deliveryPreference: payload.deliveryPreference,
      status: 'Confirmed',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    preOrderRecords.unshift(confirmation);

    // If pre-ordered, slightly reduce farmer available supply
    const remaining = Math.max(0, supply.availableKg - payload.quantityKg);
    currentSupply = currentSupply.map((s) => (s.id === payload.supplyId ? { ...s, availableKg: remaining } : s));

    return confirmation;
  },

  // Get pre-orders list
  async getPreOrders(): Promise<PreOrderConfirmation[]> {
    return [...preOrderRecords];
  },
};
