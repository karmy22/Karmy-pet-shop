import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CART_STORAGE_KEY = 'karmy-cart-v1';
const CartContext = createContext(null);

function readStoredItems() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStoredItems());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const value = useMemo(() => {
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const addProduct = (product) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.type === 'product' && item.id === product.id);
        if (existing) {
          return prev.map((item) => (
            item.type === 'product' && item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ));
        }

        return [
          ...prev,
          {
            type: 'product',
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1,
            meta: {
              badge: product.badge,
              species: product.species,
              category: product.category,
            },
          },
        ];
      });
    };

    const addCustomKit = ({ base, addons, total }) => {
      const addonsLabel = addons.map((addon) => addon.name).join(', ') || 'No add-ons';
      const kitId = `${base.id}-${addons.map((addon) => addon.id).join('-') || 'base'}`;

      setItems((prev) => {
        const existing = prev.find((item) => item.type === 'kit' && item.id === kitId);
        if (existing) {
          return prev.map((item) => (
            item.type === 'kit' && item.id === kitId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ));
        }

        return [
          ...prev,
          {
            type: 'kit',
            id: kitId,
            name: `${base.name} (${base.size})`,
            price: Number(total),
            quantity: 1,
            meta: {
              addonsLabel,
            },
          },
        ];
      });
    };

    const removeItem = (id, type) => {
      setItems((prev) => prev.filter((item) => !(item.id === id && item.type === type)));
    };

    const changeQuantity = (id, type, delta) => {
      setItems((prev) => prev
        .map((item) => {
          if (item.id !== id || item.type !== type) {
            return item;
          }

          return {
            ...item,
            quantity: Math.max(0, item.quantity + delta),
          };
        })
        .filter((item) => item.quantity > 0));
    };

    const clearCart = () => {
      setItems([]);
    };

    return {
      items,
      itemCount,
      subtotal,
      addProduct,
      addCustomKit,
      removeItem,
      changeQuantity,
      clearCart,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === null) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return ctx;
}
