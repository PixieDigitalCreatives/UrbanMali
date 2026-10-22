import { checkPincodeStatus, AreaCheckResult } from '../data/areas';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from './storage';

// Helper to simulate realistic async network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface BookingPayload {
  serviceId: string;
  serviceTitle: string;
  propertyType: 'Home' | 'Society' | 'Office' | 'Corporate' | 'Mall';
  address: string;
  pincode: string;
  locality: string;
  potRange: string;
  date: string;
  timeSlot: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  referenceId?: string;
  createdAt?: string;
}

export interface QuotePayload {
  name: string;
  phone: string;
  locality: string;
  propertyType: string;
  serviceOrPlan: string;
  notes?: string;
  createdAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderPayload {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  pincode: string;
  paymentMethod: 'UPI' | 'Cards' | 'Netbanking' | 'Cash on delivery';
  paymentStatus: 'pending' | 'success' | 'failed';
  status: 'Confirmed' | 'Packed' | 'Out for delivery' | 'Delivered';
  createdAt: string;
}

// 1. Area Availability Check
export async function checkArea(pincode: string): Promise<AreaCheckResult> {
  await delay(450);
  return checkPincodeStatus(pincode);
}

// 2. Submit Booking Request
export async function submitBooking(payload: BookingPayload): Promise<{ success: boolean; referenceId: string; data: BookingPayload }> {
  await delay(600);
  // Generate UM-YYMM-#### format as required
  const dateObj = new Date();
  const yy = String(dateObj.getFullYear()).slice(-2);
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const referenceId = `UM-${yy}${mm}-${randomSuffix}`;

  const fullBooking: BookingPayload = {
    ...payload,
    referenceId,
    createdAt: new Date().toISOString(),
  };

  saveToStorage(STORAGE_KEYS.LAST_BOOKING, fullBooking);
  saveToStorage(STORAGE_KEYS.BOOKING_DRAFT, null);

  return {
    success: true,
    referenceId,
    data: fullBooking,
  };
}

// 3. Join Waitlist for unserved / coming soon pincodes
export async function joinWaitlist(data: { name: string; phone: string; pincode: string; locality: string }): Promise<{ success: boolean; message: string }> {
  await delay(500);
  const existing = getFromStorage<any[]>(STORAGE_KEYS.WAITLIST, []);
  existing.push({ ...data, timestamp: new Date().toISOString() });
  saveToStorage(STORAGE_KEYS.WAITLIST, existing);

  return {
    success: true,
    message: "Thank you! You've been added to our priority notification list.",
  };
}

// 4. Submit Quote Request
export async function submitQuoteRequest(payload: QuotePayload): Promise<{ success: boolean; message: string }> {
  await delay(550);
  const existing = getFromStorage<QuotePayload[]>(STORAGE_KEYS.QUOTES, []);
  existing.push({ ...payload, createdAt: new Date().toISOString() });
  saveToStorage(STORAGE_KEYS.QUOTES, existing);

  return {
    success: true,
    message: "Request sent. We'll get back to you on WhatsApp or call.",
  };
}

// 5. Create Order
export async function createOrder(payload: Omit<OrderPayload, 'orderId' | 'status' | 'createdAt'>): Promise<{ success: boolean; order: OrderPayload }> {
  await delay(600);
  const dateObj = new Date();
  const yy = String(dateObj.getFullYear()).slice(-2);
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `UMO-${yy}${mm}-${randomSuffix}`;

  const order: OrderPayload = {
    ...payload,
    orderId,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  };

  saveToStorage(STORAGE_KEYS.LAST_ORDER, order);
  saveToStorage(STORAGE_KEYS.CART, []); // Clear cart on order creation

  return {
    success: true,
    order,
  };
}
