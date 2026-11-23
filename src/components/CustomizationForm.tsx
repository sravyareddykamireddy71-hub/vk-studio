'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Clock,
  CheckCircle2,
  Plus,
  Minus,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ProductType } from '@/lib/types';

interface CustomizationFormProps {
  product: ProductType;
}

export default function CustomizationForm({ product }: CustomizationFormProps) {
  const { addToCart, getWhatsAppProductUrl, getWhatsAppCustomInquiryUrl } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const price = product.basePrice || 0;
  const totalPrice = price * quantity;
  const isAvailable = product.isAvailable ?? true;

  const handleAddToCart = async () => {
    if (!isAvailable) return;
    setAddingToCart(true);
    try {
      await addToCart(product, quantity, {}, price, 0);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } finally {
      setAddingToCart(false);
    }
  };

  const whatsappInquiryUrl = getWhatsAppProductUrl(product.name, product.slug, price);

  return (
    <div className="space-y-5">
      {/* Price Display */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-500 dark:text-zinc-400 block font-semibold">
            Price
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            {price > 0 ? (
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-zinc-950 dark:text-white">
                ₹{totalPrice.toLocaleString('en-IN')}
                {quantity > 1 && (
                  <span className="text-xs font-normal text-zinc-500 ml-2">
                    (₹{price.toLocaleString('en-IN')} each)
                  </span>
                )}
              </span>
            ) : (
              <span className="text-xl font-bold text-emerald-700 dark:text-lime-400">
                Price on Request
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isAvailable ? 'Available to Order' : 'Out of Stock'}</span>
          </div>
        </div>
      </div>

      {/* Production Time Information (Minimum 4 Days) */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 dark:text-amber-200 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Preparation Time Information</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Every creation takes time and care. Our products require a minimum of 4 days for preparation. Need it urgently? Contact us on WhatsApp to discuss availability.
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between py-2 border-y border-zinc-200 dark:border-white/10">
        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
          Quantity:
        </span>
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-lg bg-white dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 text-zinc-800 dark:text-white flex items-center justify-center font-bold text-sm shadow-sm transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-mono font-bold text-zinc-950 dark:text-white text-sm">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-lg bg-white dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 text-zinc-800 dark:text-white flex items-center justify-center font-bold text-sm shadow-sm transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary & Secondary Ordering Buttons */}
      <div className="space-y-2.5 pt-1">
        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={addingToCart || !isAvailable}
          className="w-full py-3.5 px-4 rounded-xl bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-glow transition-all"
        >
          {addedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>{addingToCart ? 'Adding to Cart...' : 'Add to Cart'}</span>
            </>
          )}
        </button>

        {/* Ask About This Product on WhatsApp */}
        <a
          href={whatsappInquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Ask About This Product on WhatsApp</span>
        </a>
      </div>

      {/* Customization Callout on Product Page */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-zinc-950 dark:text-white">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-lime-400" />
          <span>Looking for Customization?</span>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
          Looking for something customized? We can create it for you. Contact us on WhatsApp to discuss your idea.
        </p>
        <a
          href={getWhatsAppCustomInquiryUrl(`I am interested in customizing "${product.name}"`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-lime-400 hover:underline pt-1"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Discuss Custom Idea on WhatsApp →</span>
        </a>
      </div>
    </div>
  );
}
