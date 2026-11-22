'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
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
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-studio-surface border-l border-white/10 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-white tracking-wide">
                Studio Cart ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Your cart is empty</h3>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1">
                    Explore our curated collection of precision 3D-printed creations or configure a custom piece.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-subtle transition-all"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  let imgUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80';
                  try {
                    const parsedImgs = JSON.parse(item.product.images);
                    if (parsedImgs && parsedImgs.length > 0) {
                      imgUrl = parsedImgs[0];
                    }
                  } catch {}

                  const customKeys = Object.keys(item.customizationData || {});

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-zinc-100 dark:bg-[#1A1D20]/95 border border-zinc-200 dark:border-white/10 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={imgUrl}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={closeCart}
                            className="text-sm font-semibold text-white hover:text-amber-400 transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-sm font-bold text-amber-400">
                              ₹{item.totalPrice.toLocaleString('en-IN')}
                            </span>
                            {item.customizationPrice > 0 && (
                              <span className="text-[10px] text-zinc-400">
                                (inc. ₹{item.customizationPrice} custom addons)
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Customization Details Badges */}
                      {customKeys.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-amber-500/80 font-bold">
                            Configured Specifications:
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {customKeys.map((key) => {
                              const val = item.customizationData[key];
                              if (!val) return null;
                              return (
                                <span
                                  key={key}
                                  className="inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-zinc-300"
                                >
                                  <strong className="text-zinc-400 capitalize">
                                    {key.replace(/_/g, ' ')}:
                                  </strong>{' '}
                                  {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 font-mono text-xs font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-[11px] font-mono text-zinc-400">
                          Unit: ₹{(item.unitPrice + item.customizationPrice).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer: Actions */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#1A1D20]/90 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    White-Glove Shipping
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {subtotal >= 1999 ? 'FREE' : '₹150'}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-base font-bold text-white">
                  <span>Estimated Total</span>
                  <span className="font-mono text-amber-400 text-lg">
                    ₹{(subtotal >= 1999 ? subtotal : subtotal + 150).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                {/* Checkout Link */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-subtle hover:shadow-glow transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* WhatsApp Order Discussion Button */}
                <a
                  href={getWhatsAppShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-medium text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Discuss Order on WhatsApp</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>3D Slicing Review • Made to Order • 100% Quality Guaranteed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
