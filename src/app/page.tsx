import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Sliders,
  ShieldCheck,
  MessageSquare,
  Clock,
  Star,
  Cpu,
  Compass,
  CheckCircle2,
  Box,
  Palette,
  Terminal,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import ThreeCanvas from '@/components/ThreeCanvas';
import { ProductType, ReviewType } from '@/lib/types';

export const revalidate = 0; // Fresh dynamic data on every request

async function getLandingData() {
  const [featuredProducts, categories, reviews, settingsRaw] = await Promise.all([
    prisma.product.findMany({
      where: { isAvailable: true },
      include: {
        category: true,
        reviews: { where: { isPublished: true } },
      },
      orderBy: { isFeatured: 'desc' },
      take: 6,
    }),
    prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.review.findMany({
      where: { isPublished: true },
      include: {
        product: { select: { name: true, slug: true } },
      },
      orderBy: { rating: 'desc' },
      take: 6,
    }),
    prisma.websiteSetting.findUnique({
      where: { key: 'general_settings' },
    }),
  ]);

  const settings = settingsRaw ? JSON.parse(settingsRaw.value) : {};

  const enrichedProducts = featuredProducts.map((p) => {
    const totalReviews = p.reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number((p.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
        : 5.0;

    return {
      ...p,
      totalReviews,
      averageRating,
    };
  });

  return {
    featuredProducts: enrichedProducts as unknown as ProductType[],
    categories,
    reviews: reviews as unknown as ReviewType[],
    settings,
  };
}

export default async function HomePage() {
  const { featuredProducts, categories, reviews, settings } = await getLandingData();

  const whatsappNumber = (settings.whatsappNumber || '+91 91004 84870').replace(/[^0-9]/g, '');

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 md:pt-12 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Studio Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wide text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{settings.heroBadge || 'Precision FDM & SLA Resin Fabrication'}</span>
              </div>

              {/* Headline */}
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1]">
                Your Imagination.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                  Our Creation.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
                {settings.heroSubheadline ||
                  'Discover thoughtfully designed 3D-printed products or bring your own ideas to life with personalized creations from VK STUDIO.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm tracking-wide shadow-subtle hover:shadow-glow transition-all flex items-center gap-2 group"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/custom-quote"
                  className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-500/50 text-white font-medium text-sm transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Create Your Own</span>
                </Link>
              </div>

              {/* Studio Metrics Highlights */}
              <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-left">
                <div>
                  <p className="font-mono text-2xl font-black text-white">50µm</p>
                  <p className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider mt-0.5">
                    Layer Resolution
                  </p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-black text-amber-400">100%</p>
                  <p className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider mt-0.5">
                    Made-To-Order
                  </p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-black text-white">4.9★</p>
                  <p className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider mt-0.5">
                    Client Satisfaction
                  </p>
                </div>
              </div>
            </div>

            {/* Right Hero: Interactive 3D Canvas Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                {/* Visual Glass Frame */}
                <div className="relative rounded-3xl p-2 bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/15 shadow-premium">
                  <ThreeCanvas modelType="dragon" colorHex="#C5A880" />
                </div>

                {/* Micro Floating Badges */}
                <div className="absolute -top-3 -left-3 px-3 py-1.5 rounded-xl bg-studio-card/90 backdrop-blur-md border border-white/15 text-[11px] font-mono text-amber-400 shadow-lg flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Dual Co-Extrusion Active</span>
                </div>

                <div className="absolute -bottom-3 -right-3 px-3 py-1.5 rounded-xl bg-studio-card/90 backdrop-blur-md border border-white/15 text-[11px] font-mono text-emerald-400 shadow-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Real-time Interactive 3D</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
            Precision Fabrication Disciplines
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Curated 3D Product Categories
          </h2>
          <p className="text-zinc-400 text-sm">
            From kinetic sculptures and ambient shadow fixtures to architectural signage and daily desk companions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="p-5 rounded-2xl bg-studio-surface border border-white/10 hover:border-amber-500/50 hover:bg-white/5 transition-all duration-300 text-center flex flex-col items-center justify-center space-y-3 group shadow-subtle"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-amber-500/20 text-zinc-300 group-hover:text-amber-400 border border-white/10 group-hover:border-amber-500/30 flex items-center justify-center transition-all">
                <Box className="w-6 h-6 transition-transform group-hover:scale-110" />
              </div>
              <div>
                <h3 className="font-semibold text-xs text-white group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                  {cat._count.products} Designs
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
              Signature Works
            </p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mt-1">
              Featured Studio Creations
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>View All Available Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. ABOUT VK STUDIO & CAPABILITIES */}
      <section id="about" className="relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-studio-surface border border-white/10 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>About Our Studio</span>
                </div>

                <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                  {settings.aboutTitle || 'Craftsmanship Meets High-Precision Additive Manufacturing'}
                </h2>

                <p className="text-zinc-300 text-sm leading-relaxed font-light">
                  {settings.aboutDescription ||
                    'VK STUDIO was founded on a simple philosophy: bridging bespoke artisanal design with industrial-grade 3D printing technology. Every piece is carefully sliced, monitored across hundreds of micro-layers, hand-finished, and curated to perfection in our studio.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <h4 className="font-bold text-white text-xs flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-amber-400" />
                      Industrial Hardware
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Multi-material high-flow hotends capable of reinforced Carbon Fiber & TPU.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <h4 className="font-bold text-white text-xs flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-400" />
                      Artisanal Palette
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Dual-tone silk co-extrusion, matte basalt, stone-fill composites & 24K leaf flakes.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/custom-quote"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-subtle transition-all"
                  >
                    <span>Request Custom Commission</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Side: Studio Workflow Visualization */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-6 rounded-2xl bg-black/50 border border-white/10 space-y-4">
                  <p className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    The VK STUDIO Fabrication Standard
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        01
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Algorithmic CAD & Slicing</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Adaptive layer heights from 0.08mm to 0.2mm to preserve microscopic contours while optimizing structural shear strength.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        02
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Precision Chamber Fabrication</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Enclosed chamber printing eliminates layer delamination, warping, and ambient drafts for airtight structural integrity.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        03
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Manual Post-Processing & Curing</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Support artifacts micro-trimmed, surfaces vapor-smoothed or hand-sanded, and UV resin prints post-cured at 405nm.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        04
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Direct Artisan Dialogue</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Direct WhatsApp confirmation with slicing screenshots and dispatch tracking prior to shipping.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CLIENT REVIEWS SECTION */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
            Verified Feedback
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Client Impressions & Reviews
          </h2>
          <p className="text-zinc-400 text-sm">
            Genuine experiences from architects, collectors, gift-givers, and design enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-studio-surface border border-white/10 flex flex-col justify-between space-y-4 shadow-subtle hover:border-amber-500/30 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-700'
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

                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  &ldquo;{rev.reviewText}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white text-xs">{rev.authorName}</h4>
                  {rev.product && (
                    <Link
                      href={`/products/${rev.product.slug || rev.productId}`}
                      className="text-[10px] text-amber-400 hover:underline block truncate max-w-[180px]"
                    >
                      {rev.product.name}
                    </Link>
                  )}
                </div>

                <span className="text-[10px] text-zinc-500 font-mono">
                  {new Date(rev.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHATSAPP & CUSTOM COMMISSION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-studio-card to-zinc-950 border border-amber-500/30 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-premium">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Have a Specific STL or 3D Idea?</span>
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              Bespoke Studio Commissions
            </h2>
            <p className="text-zinc-300 text-sm font-light">
              Send us your custom 3D model files, sketches, or ideas. We offer CAD design services, rapid slicing estimates, and high-tolerance fabrication.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/custom-quote"
              className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs tracking-wide shadow-subtle hover:shadow-glow transition-all flex items-center gap-2"
            >
              <span>Submit Custom CAD / Idea</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello VK STUDIO! I would like to consult with an artisan regarding a custom 3D commission.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Consult on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
