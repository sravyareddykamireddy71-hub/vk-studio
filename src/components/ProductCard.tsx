'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Clock, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ProductType } from '@/lib/types';

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  let images: string[] = [];
  try {
    images = JSON.parse(product.images || '[]');
  } catch {
    images = ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'];
  }

  const primaryImage = images[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = images[1] || primaryImage;

  return (
    <div className="group relative rounded-2xl bg-studio-surface border border-white/10 hover:border-amber-500/40 shadow-subtle hover:shadow-premium transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] w-full overflow-hidden bg-black/40 block">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {images.length > 1 && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          />
        )}

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-wider uppercase text-zinc-300 font-semibold">
            {product.category.name}
          </div>
        )}

        {/* Availability / Lead Time Pill */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{product.leadTimeDays}d Slicing</span>
        </div>

        {/* Bottom subtle gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-studio-surface via-studio-surface/50 to-transparent opacity-80" />
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="font-display font-bold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
          </div>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {product.tagline || product.description}
          </p>
        </div>

        {/* Rating and Features */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-zinc-400">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-white text-xs">{product.averageRating || 5.0}</span>
            <span className="text-[11px] text-zinc-500">
              ({product.totalReviews || 1})
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Customizable</span>
          </div>
        </div>

        {/* Pricing and Action Button */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
              Starts At
            </span>
            <span className="font-mono text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors">
              ₹{product.basePrice.toLocaleString('en-IN')}
            </span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-amber-600 border border-white/10 hover:border-amber-500 text-xs font-semibold text-white transition-all shadow-subtle group/btn"
          >
            <span>Customize</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
