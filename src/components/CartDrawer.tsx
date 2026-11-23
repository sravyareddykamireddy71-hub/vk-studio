'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    getWhatsAppShareUrl,
    getWhatsAppCustomInquiryUrl,
  } = useCart();
  const [customNote, setCustomNote] = useState('');

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white dark:bg-[#141618] border-l border-zinc-200 dark:border-white/10 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-emerald-700 dark:text-lime-400" />
              <h2 className="text-base font-bold text-zinc-950 dark:text-white tracking-wide">
                My Cart ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-white">Your cart is empty</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mt-1">
                    Explore our curated 3D printed creations or reach out to us on WhatsApp with your custom design ideas.
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-2 max-w-xs mx-auto">
                  <Link
                    href="/products"
                    onClick={closeCart}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs shadow-sm transition-all"
                  >
                    <span>Browse Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={getWhatsAppCustomInquiryUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Contact on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  let imgUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80';
                  try {
                    const parsedImgs = JSON.parse(item.product.images);
                    if (parsedImgs && parsedImgs.length > 0) {
                      imgUrl = parsedImgs[0];
                    }
                  } catch {}

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#1A1D20]/95 border border-zinc-200 dark:border-white/10 space-y-2.5"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={imgUrl}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-cover border border-zinc-200 dark:border-white/10 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={closeCart}
                            className="text-sm font-semibold text-zinc-950 dark:text-white hover:text-emerald-700 dark:hover:text-lime-400 transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-sm font-bold text-emerald-700 dark:text-lime-400">
                              ₹{item.totalPrice.toLocaleString('en-IN')}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                (₹{item.unitPrice.toLocaleString('en-IN')} each)
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-red-500 p-1.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between pt-1 border-t border-zinc-200/60 dark:border-white/5">
                        <div className="flex items-center gap-1 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg p-0.5 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 font-mono text-xs font-bold text-zinc-950 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                          Total: ₹{item.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Customization Callout Inside Cart */}
                <div className="p-3.5 rounded-2xl bg-zinc-100/80 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-950 dark:text-white">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" />
                    <span>Have Custom Requirements?</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Looking for something customized? We can create it for you. Contact us on WhatsApp to discuss your idea.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer: Actions & WhatsApp Integration */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#1A1D20]/90 space-y-3">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-zinc-600 dark:text-zinc-400">Estimated Subtotal</span>
                <span className="font-mono text-zinc-950 dark:text-white font-black text-lg">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* 4-Day Preparation Notice */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Preparation Time Information</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Every creation takes time and care. Our products require a minimum of 4 days for preparation. Need it urgently? Contact us on WhatsApp to discuss availability.
                </p>
              </div>

              {/* Optional Customization Request / Note */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                  <span>Customization note / special requests:</span>
                  <span className="text-[10px] text-zinc-400 font-normal">Optional</span>
                </label>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Please print name 'Rahul' on the keychain in silk gold..."
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-600 dark:focus:border-lime-400 transition-all resize-none shadow-sm"
                />
              </div>

              {/* Primary Action: Proceed on WhatsApp */}
              <div className="space-y-2 pt-1">
                <a
                  href={getWhatsAppShareUrl(customNote)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-glow transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                  <span>Proceed on WhatsApp</span>
                </a>
                <p className="text-[10px] text-center text-zinc-500 dark:text-zinc-400">
                  Connects directly with VK STUDIO on WhatsApp. Final pricing, customization details, and payment are confirmed in chat. Your cart remains saved here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
