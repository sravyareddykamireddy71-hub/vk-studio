'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  Truck,
  Box,
  Eye,
  CheckCircle2,
  Send,
  MessageCircle,
} from 'lucide-react';
import ThreeCanvas from '@/components/ThreeCanvas';
import CustomizationForm from '@/components/CustomizationForm';
import { ProductType, ReviewType } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

interface ProductDetailClientProps {
  product: ProductType;
  reviews: ReviewType[];
  relatedProducts: ProductType[];
}

export default function ProductDetailClient({
  product,
  reviews: initialReviews,
  relatedProducts,
}: ProductDetailClientProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'photos' | '3d'>('photos');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewType[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [authorName, setAuthorName] = useState(user?.name || '');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  let images: string[] = [];
  try {
    images = JSON.parse(product.images || '[]');
  } catch {
    images = ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'];
  }

  const primaryImage = images[selectedImageIndex] || images[0];

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewText.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          authorName: authorName.trim(),
          rating,
          reviewText: reviewText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.review) {
        setReviews([data.review, ...reviews]);
        setReviewSuccess(true);
        setReviewText('');
        setTimeout(() => {
          setShowReviewForm(false);
          setReviewSuccess(false);
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
        <Link href="/" className="hover:text-amber-400 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-amber-400 transition-colors">
          Products
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-amber-400 transition-colors"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-zinc-200 truncate">{product.name}</span>
      </nav>

      {/* Main Product & Customization Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Visual Gallery & Interactive 3D Viewer */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
          {/* Mode Switcher: High-Res Photos vs Realtime 3D CAD */}
          <div className="flex items-center justify-between p-1.5 bg-studio-surface border border-white/10 rounded-2xl">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'photos'
                  ? 'bg-amber-600 text-white shadow-subtle'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Studio Photography ({images.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('3d')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
                activeTab === '3d'
                  ? 'bg-amber-600 text-white shadow-subtle'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactive 3D CAD Preview</span>
            </button>
          </div>

          {/* Viewport */}
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-studio-surface border border-white/15 shadow-premium">
            {activeTab === 'photos' ? (
              <img
                src={primaryImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            ) : (
              <ThreeCanvas
                modelType={product.model3dType || 'geometric'}
                colorHex="#C5A880"
              />
            )}

            {/* Availability Pill */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>In Studio Stock & Ready to Slice</span>
            </div>
          </div>

          {/* Thumbnail Strip (for Photos mode) */}
          {activeTab === 'photos' && images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-amber-500 scale-105'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Product Specifications Table */}
          <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Fabrication Specifications</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-500 block text-[10px] uppercase font-mono">Dimensions</span>
                <span className="font-semibold text-white mt-0.5 block">
                  {product.dimensions || 'Customizable to Scale'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-500 block text-[10px] uppercase font-mono">Finished Weight</span>
                <span className="font-semibold text-white mt-0.5 block">
                  {product.weight || 'Approx. 180g'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-500 block text-[10px] uppercase font-mono">Slicing Lead Time</span>
                <span className="font-semibold text-amber-400 mt-0.5 block">
                  {product.leadTimeDays} Business Days
                </span>
              </div>
            </div>

            <div className="pt-2 text-xs text-zinc-400 leading-relaxed">
              <p>{product.description}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Customization & Ordering Workbench */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              {product.category && (
                <span className="font-mono text-amber-400 font-semibold uppercase tracking-wider">
                  {product.category.name}
                </span>
              )}
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1 text-zinc-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold">{product.averageRating || 5.0}</span>
                <span className="text-zinc-500">({reviews.length} reviews)</span>
              </div>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {product.tagline}
              </p>
            )}
          </div>

          {/* Dynamic Customization Form Component */}
          <div className="rounded-2xl bg-studio-surface border border-white/10 p-6 shadow-subtle">
            <CustomizationForm product={product} />
          </div>

          {/* Studio Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 text-[11px] text-zinc-400">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Safe White-Glove Dispatch</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Post-Print Micro QC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Client Feedback Section */}
      <div className="border-t border-white/10 pt-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-white tracking-tight">
              Client Feedback & Studio Reviews
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Read verified impressions on finish quality, layer tolerances, and custom configurations.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white transition-all self-start"
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Product Review'}
          </button>
        </div>

        {/* Write Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="p-6 rounded-2xl bg-studio-surface border border-amber-500/30 space-y-4 max-w-xl animate-in fade-in duration-200"
          >
            <h3 className="text-sm font-bold text-white">Share Your Product Experience</h3>

            {reviewSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you! Your verified review has been published.</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-zinc-300 font-medium block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Nair"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-medium block mb-1">Rating *</label>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className="p-1 text-zinc-600 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              s <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-zinc-300 font-medium block mb-1">Your Review *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe print quality, bed adhesion, color vibrance, or customization accuracy..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Publishing...' : 'Publish Review'}</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">
            No reviews yet for this product. Be the first to share your studio review!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-studio-surface border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                  {rev.isVerifiedPurchase && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-300 italic leading-relaxed">
                  &ldquo;{rev.reviewText}&rdquo;
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="font-semibold text-white">{rev.authorName}</span>
                  <span className="font-mono">
                    {new Date(rev.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-white/10 pt-16 space-y-8">
          <div>
            <h2 className="font-display font-bold text-2xl text-white tracking-tight">
              Complementary Studio Designs
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Explore related 3D creations crafted with identical filament finishes and standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => {
              let imgs = [];
              try {
                imgs = JSON.parse(p.images || '[]');
              } catch {}
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group p-4 rounded-2xl bg-studio-surface border border-white/10 hover:border-amber-500/40 transition-all flex items-center gap-4"
                >
                  <img
                    src={imgs[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'}
                    alt={p.name}
                    className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors truncate">
                      {p.name}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">{p.tagline}</p>
                    <span className="font-mono text-xs font-bold text-amber-400 mt-1 block">
                      ₹{p.basePrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
