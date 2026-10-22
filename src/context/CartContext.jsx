import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../lib/storage';

const CartContext = createContext(undefined);

const INITIAL_DEMO_ITEMS = [
  {
    id: 'demo-1',
    productId: 'money-plant',
    name: 'Money Plant (Indoor)',
    size: 'Medium',
    price: 299,
    quantity: 1,
    image: '/images/product-money-plant.jpg',
  },
  {
    id: 'demo-2',
    productId: 'ceramic-planter',
    name: 'Ceramic Planter (Fluted Tan)',
    size: 'Medium',
    price: 499,
    quantity: 1,
    image: '/images/product-ceramic-planter.jpg',
  },
  {
    id: 'demo-3',
    productId: 'organic-compost',
    name: 'Organic Vermicompost',
    size: '1 kg',
    price: 199,
    quantity: 1,
    image: '/images/product-organic-compost.jpg',
  },
];

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    return getFromStorage(STORAGE_KEYS.CART, INITIAL_DEMO_ITEMS);
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CART, items);
  }, [items]);

  useEffect(() => {
    const handleStorage = () => {
      setItems(getFromStorage(STORAGE_KEYS.CART, []));
    };
    window.addEventListener('um_storage_update', handleStorage);
    return () => window.removeEventListener('um_storage_update', handleStorage);
  }, []);

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id: `${item.productId}-${item.size}-${Date.now()}` }];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
