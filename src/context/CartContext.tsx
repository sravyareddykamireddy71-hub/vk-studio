'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    images: string;
    leadTimeDays: number;
  };
  quantity: number;
  customizationData: Record<string, any>;
  unitPrice: number;
  customizationPrice: number;
  totalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (
    product: any,
    quantity: number,
    customizationData: Record<string, any>,
    unitPrice: number,
    customizationPrice: number
  ) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getWhatsAppShareUrl: (whatsappNumber?: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_STORAGE_KEY = 'vk_guest_cart_v1';
const GUEST_SESSION_KEY = 'vk_guest_session_id';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [guestSessionId, setGuestSessionId] = useState<string>('');

  // Initialize guest session ID on mount
  useEffect(() => {
    let sid = localStorage.getItem(GUEST_SESSION_KEY);
    if (!sid) {
      sid = 'guest_' + Math.random().toString(36).substring(2, 12);
      localStorage.setItem(GUEST_SESSION_KEY, sid);
    }
    setGuestSessionId(sid);
  }, []);

  // Fetch or sync cart
  const refreshCart = useCallback(async () => {
    if (user) {
      // If user logged in, check if there was a local guest cart to sync
      const localCart = localStorage.getItem(GUEST_CART_STORAGE_KEY);
      if (localCart) {
        try {
          const guestItems: CartItem[] = JSON.parse(localCart);
          if (guestItems.length > 0) {
            await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'sync', guestItems }),
            });
            localStorage.removeItem(GUEST_CART_STORAGE_KEY);
          }
        } catch (e) {
          console.error('Error syncing guest cart:', e);
        }
      }

      // Fetch user's persistent database cart
      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
        }
      } catch (e) {
        console.error('Failed to load DB cart:', e);
      }
    } else {
      // Guest: load from localStorage
      const localCart = localStorage.getItem(GUEST_CART_STORAGE_KEY);
      if (localCart) {
        try {
          setItems(JSON.parse(localCart));
        } catch {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Save guest cart locally when items change and user is null
  const saveGuestCart = (newItems: CartItem[]) => {
    if (!user) {
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(newItems));
    }
    setItems(newItems);
  };

  const addToCart = async (
    product: any,
    quantity: number,
    customizationData: Record<string, any>,
    unitPrice: number,
    customizationPrice: number
  ) => {
    const singleTotal = (unitPrice + customizationPrice) * quantity;

    if (user) {
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            quantity,
            customizationData,
            unitPrice,
            customizationPrice,
            totalPrice: singleTotal,
          }),
        });

        if (res.ok) {
          await refreshCart();
          setIsCartOpen(true);
        }
      } catch (err) {
        console.error('Add to DB cart error:', err);
      }
    } else {
      // Guest item
      const newItem: CartItem = {
        id: 'guest_item_' + Date.now() + Math.random().toString(36).substring(2, 6),
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          basePrice: product.basePrice,
          images: typeof product.images === 'string' ? product.images : JSON.stringify(product.images),
          leadTimeDays: product.leadTimeDays || 3,
        },
        quantity,
        customizationData,
        unitPrice,
        customizationPrice,
        totalPrice: singleTotal,
      };

      const next = [...items, newItem];
      saveGuestCart(next);
      setIsCartOpen(true);
    }
  };

  const updateQuantity = async (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      await removeFromCart(itemId);
      return;
    }

    if (user) {
      try {
        await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: itemId, quantity: newQty }),
        });
        await refreshCart();
      } catch (err) {
        console.error('Update quantity error:', err);
      }
    } else {
      const next = items.map((it) => {
        if (it.id === itemId) {
          const single = it.unitPrice + it.customizationPrice;
          return {
            ...it,
            quantity: newQty,
            totalPrice: single * newQty,
          };
        }
        return it;
      });
      saveGuestCart(next);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (user) {
      try {
        await fetch(`/api/cart?id=${itemId}`, { method: 'DELETE' });
        await refreshCart();
      } catch (err) {
        console.error('Remove from cart error:', err);
      }
    } else {
      const next = items.filter((it) => it.id !== itemId);
      saveGuestCart(next);
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await fetch('/api/cart?clearAll=true', { method: 'DELETE' });
        setItems([]);
      } catch (err) {
        console.error('Clear cart error:', err);
      }
    } else {
      localStorage.removeItem(GUEST_CART_STORAGE_KEY);
      setItems([]);
    }
  };

  // WhatsApp Order Discussion URL generator
  const getWhatsAppShareUrl = (customWhatsappNumber?: string) => {
    const rawNumber = customWhatsappNumber || '+919876543210';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    if (items.length === 0) {
      const message = encodeURIComponent(
        `*Hello VK STUDIO!* 👋\n\nI am browsing your 3D printing studio and would like to inquire about a custom commission.`
      );
      return `https://wa.me/${cleanNumber}?text=${message}`;
    }

    let text = `*New Order Inquiry – VK STUDIO*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (user) {
      text += `*Customer:* ${user.name} (${user.email})\n`;
      if (user.phone) text += `*Phone:* ${user.phone}\n`;
      text += `\n`;
    }

    text += `*Items in Cart (${items.length}):*\n\n`;

    items.forEach((item, index) => {
      text += `*${index + 1}. ${item.product.name}*\n`;
      text += `• Qty: ${item.quantity}\n`;
      text += `• Price: ₹${item.totalPrice.toLocaleString('en-IN')}\n`;

      const customKeys = Object.keys(item.customizationData || {});
      if (customKeys.length > 0) {
        text += `• *Customizations:*\n`;
        customKeys.forEach((key) => {
          const val = item.customizationData[key];
          if (val) {
            text += `   - ${key.replace(/_/g, ' ')}: ${val}\n`;
          }
        });
      }
      text += `\n`;
    });

    const subtotal = items.reduce((acc, it) => acc + it.totalPrice, 0);
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `*Estimated Cart Total:* ₹${subtotal.toLocaleString('en-IN')}\n\n`;
    text += `I would like to discuss fabrication timelines, filament finish samples, and finalize this order. Thank you!`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = items.reduce((sum, it) => sum + it.totalPrice, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getWhatsAppShareUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
