'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Clock, ShoppingBag, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { ProductType } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, openCart, whatsappNumber } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  let images: string[] = [];
  try {
    images = JSON.parse(product.images || '[]');
  } catch {
    images = ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'];
  }

  const primaryImage = images[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = images[1] || primaryImage;

  const cleanNumber = (whatsappNumber || '+91 91004 84870').replace(/[^0-9]/g, '');
  const productWhatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    `Hello VK STUDIO! I would like to ask about "${product.name}"${
      product.basePrice > 0 ? ` (Listed Price: ₹${product.basePrice.toLocaleString('en-IN')})` : ''
    }. Could you please share more details, customization possibilities, and availability?`
  )}`;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;

    setIsAdding(true);
    try {
      await addToCart(product, 1);
      setJustAdded(true);
      openCart();
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative hyper-card flex flex-col overflow-hidden will-change-transform">
      {/* Product Photography Container with Studio Pedestal Shadow */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-black/60 block group/img pedestal-shadow"
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        {images.length > 1 && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
          />
        )}

        {/* Ambient Top Vignette for Badges */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-wider uppercase text-zinc-100 font-bold shadow-sm">
            {product.category.name}
          </div>
        )}

        {/* Minimum 4 Days Preparation Pill */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-amber-400/30 text-[10px] font-mono text-amber-300 font-semibold flex items-center gap-1 shadow-sm">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>Min. 4d Prep</span>
        </div>

        {/* Bottom subtle gradient blend */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-[#121317] to-transparent opacity-80 pointer-events-none" />
      </Link>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <Link
            href={`/products/${product.slug}`}
            className="font-display font-extrabold text-base sm:text-lg text-zinc-950 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-lime-400 transition-colors duration-300 line-clamp-1 block"
          >
            {product.name}
          </Link>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed font-normal">
            {product.tagline || product.description}
          </p>
        </div>

        {/* Ratings and Availability */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-white/5 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-extrabold text-zinc-900 dark:text-white text-xs">{product.averageRating || 5.0}</span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
              ({product.totalReviews || 1} {product.totalReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-700 dark:text-lime-400 font-bold">
            100% 3D Printed
          </span>
        </div>

        {/* Pricing & Interactive Action Buttons */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block font-semibold">
              {product.basePrice > 0 ? 'Listed Price' : 'Inquiry'}
            </span>
            <span className="font-mono text-lg sm:text-xl font-black text-zinc-950 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-lime-400 transition-colors duration-300">
              {product.basePrice > 0 ? `₹${product.basePrice.toLocaleString('en-IN')}` : 'On Request'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Ask on WhatsApp Button */}
            <a
              href={productWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Ask about this product on WhatsApp"
              className="p-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-800 dark:text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-emerald-500 transition-all duration-300 shadow-sm hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Elegant Add to Cart Button with Hover Highlight */}
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isAdding}
              title="Add product to cart"
              className={`p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-300 shadow-sm ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-lime-500 hover:bg-lime-400 text-black font-extrabold shadow-sm hover:shadow-lime-500/25 hover:-translate-y-0.5'
              }`}
            >
              {justAdded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline">Add to Cart</span>
                </>
              )}
            </button>

            {/* View Details Link */}
            <Link
              href={`/products/${product.slug}`}
              className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 transition-all hover:-translate-y-0.5 shadow-sm"
              title="Open full product details"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
