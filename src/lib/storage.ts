// LocalStorage wrapper with safe fallbacks and cross-window sync

export const STORAGE_KEYS = {
  CART: 'um_cart_items',
  BOOKING_DRAFT: 'um_booking_draft',
  LAST_BOOKING: 'um_last_booking',
  LAST_ORDER: 'um_last_order',
  WAITLIST: 'um_waitlist_entries',
  QUOTES: 'um_quote_requests',
} as const;

export function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('um_storage_update'));
  } catch (err) {
    console.warn(`Error writing to localStorage key "${key}":`, err);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
    window.dispatchEvent(new Event('um_storage_update'));
  } catch (err) {
    console.warn(`Error removing localStorage key "${key}":`, err);
  }
}
