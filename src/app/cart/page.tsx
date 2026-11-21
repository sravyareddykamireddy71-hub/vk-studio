'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  MessageCircle,
  Truck,
  ShieldCheck,
  Layers,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { user } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    getWhatsAppShareUrl,
  } = useCart();

  const shippingFee = subtotal >= 1999 || subtotal === 0 ? 0 : 150;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-amber-500" />
            <span>Studio Shopping Cart</span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Review your customized specifications, calculate production estimates, or consult our artisans directly.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Clear All Items
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center space-y-5 rounded-3xl bg-studio-surface border border-white/10 p-12">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Your Studio Cart is Empty</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 leading-relaxed">
              Every creation at VK STUDIO is tailored to your exact filament, color, and dimensional requirements.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-subtle hover:shadow-glow transition-all"
            >
              <span>Explore Products Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              let imgUrl =
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80';
              try {
                const parsed = JSON.parse(item.product.images);
                if (parsed.length > 0) imgUrl = parsed[0];
              } catch {}

              const customKeys = Object.keys(item.customizationData || {});

              return (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4 shadow-subtle"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <img
                      src={imgUrl}
                      alt={item.product.name}
                      className="w-24 h-24 rounded-2xl object-cover border border-white/10 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-display font-bold text-base text-white hover:text-amber-400 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                        <span>Base: ₹{item.unitPrice.toLocaleString('en-IN')}</span>
                        {item.customizationPrice > 0 && (
                          <span className="text-amber-400">
                            + Customizations: ₹{item.customizationPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customization Details Grid */}
                  {customKeys.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                        Bespoke Configured Specifications:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {customKeys.map((key) => {
                          const val = item.customizationData[key];
                          if (!val) return null;
                          return (
                            <span
                              key={key}
                              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-zinc-200"
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

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">Quantity:</span>
                      <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-white text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block font-mono">Item Total</span>
                      <span className="font-mono text-base font-bold text-amber-400">
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue browsing products</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Actions */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-6 shadow-subtle">
              <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                Order Summary ({itemCount} {itemCount === 1 ? 'Piece' : 'Pieces'})
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-white">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>White-Glove Shipping</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>

                {subtotal < 1999 && (
                  <p className="text-[11px] text-amber-400/80 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    Add ₹{(1999 - subtotal).toLocaleString('en-IN')} more for complimentary white-glove shipping!
                  </p>
                )}

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-base font-bold text-white">
                  <span>Estimated Total</span>
                  <span className="font-mono text-xl text-amber-400">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-subtle hover:shadow-glow transition-all"
                >
                  <span>Proceed to Studio Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Prominent WhatsApp Consultation Button */}
                <div className="space-y-1.5">
                  <a
                    href={getWhatsAppShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Discuss Order on WhatsApp</span>
                  </a>
                  <p className="text-[10px] text-zinc-500 text-center leading-tight">
                    * Opens an external WhatsApp conversation with our studio director with your prefilled specifications. No order is placed until final confirmation.
                  </p>
                </div>
              </div>

              {/* Guarantees */}
              <div className="pt-2 border-t border-white/5 space-y-2 text-[11px] text-zinc-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sub-50 micron layer accuracy guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Freshly sliced and hand post-processed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
