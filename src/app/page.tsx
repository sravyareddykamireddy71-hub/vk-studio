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
  CheckCircle2,
  Box,
  Palette,
  Truck,
  Heart,
  HelpCircle,
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
      {/* ============================================================== */}
      {/* 1. HERO SECTION: EXCLUSIVE FLOATING LOGO & SIGNATURE SAYING     */}
      {/* ============================================================== */}
      <section className="relative pt-10 md:pt-20 overflow-hidden text-center">
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-lime-500/10 rounded-full blur-[140px] pointer-events-none animate-glow-pulse" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl p-8 sm:p-14 glass-panel border border-white/10 shadow-premium space-y-8 relative overflow-hidden backdrop-blur-2xl">
            {/* Ambient inner spotlight glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-lime-400/15 rounded-full blur-[100px] pointer-events-none" />

            {/* Subtle Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wider text-lime-400 uppercase font-semibold shadow-subtle">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span>VK STUDIO • BY VAMSI KRISHNA</span>
            </div>

            {/* Exclusive Floating Official Logo */}
            <div className="flex justify-center items-center py-2">
              <div className="relative group">
                {/* Backlight Glow */}
                <div className="absolute inset-0 rounded-3xl bg-lime-400/25 blur-3xl group-hover:bg-lime-400/40 transition-all duration-500" />
                
                {/* Floating Logo Container */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-3xl p-3 bg-black/90 border-2 border-white/20 hover:border-lime-400 shadow-premium animate-float hover-lift">
                  <img
                    src="/images/logo.jpg"
                    alt="VK STUDIO - Vamsi Krishna"
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Signature Saying */}
            <div className="space-y-4 max-w-3xl mx-auto">
              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.08]">
                Your Imagination,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-300 to-lime-500">
                  My Creation
                </span>
              </h1>

              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
                Turn your names, ideas, and favorite designs into high-quality 3D printed items you can hold. We specialize strictly in custom 3D printing — made with care and shipped right to your door.
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="#products"
                className="px-8 py-4 rounded-2xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-sm tracking-wide shadow-subtle hover:shadow-glow hover:-translate-y-1 transition-all flex items-center gap-2 group"
              >
                <span>Explore 3D Products</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/custom-quote"
                className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-lime-400/60 text-white font-bold text-sm hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-lime-400" />
                <span>Request Custom 3D Design</span>
              </Link>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  'Hi Vamsi Krishna! I visited VK STUDIO and would like to order a custom 3D printed item.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Chat</span>
              </a>
            </div>

            {/* 4 Customer Confidence Badges (Simple Terminology) */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-studio-surface/80 border border-white/10 hover-lift">
                <div className="flex items-center gap-2 text-lime-400 font-bold text-xs mb-1">
                  <Box className="w-4 h-4" />
                  <span>100% 3D Printed</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  Authentic layer-by-layer 3D prints using strong, durable filaments. No resin crafts or mold plastics.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-studio-surface/80 border border-white/10 hover-lift">
                <div className="flex items-center gap-2 text-lime-400 font-bold text-xs mb-1">
                  <Sliders className="w-4 h-4" />
                  <span>Personalized For You</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  Add your name, choose your favorite colors, and select custom dimensions easily.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-studio-surface/80 border border-white/10 hover-lift">
                <div className="flex items-center gap-2 text-lime-400 font-bold text-xs mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>Direct WhatsApp Updates</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  Direct chat with Vamsi Krishna on WhatsApp for previews, photos, and answers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-studio-surface/80 border border-white/10 hover-lift">
                <div className="flex items-center gap-2 text-lime-400 font-bold text-xs mb-1">
                  <Truck className="w-4 h-4" />
                  <span>Safe Doorstep Delivery</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  Carefully cushioned and shipped safely to your home anywhere across India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. INTERACTIVE 3D CAD VIEWER DEMO                              */}
      {/* ============================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-studio-surface border border-white/10 p-6 sm:p-10 shadow-premium relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-xs font-mono text-lime-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive 3D Preview</span>
              </div>

              <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                Inspect Your Prints in Full 3D
              </h2>

              <p className="text-zinc-300 text-sm leading-relaxed">
                Before we 3D print your item, test and preview it right on your screen. Drag to spin the model around, toggle wireframe layers, and change filament colors live!
              </p>

              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs font-bold text-lime-400 hover:text-lime-300 transition-colors"
                >
                  <span>Customize any product in 3D</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative rounded-2xl p-2 bg-black/60 border border-white/15 shadow-subtle">
                <ThreeCanvas modelType="dragon" colorHex="#a3e635" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. POPULAR 3D PRINTED CATEGORIES                               */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <p className="text-xs font-mono uppercase tracking-widest text-lime-400 font-bold">
            What We 3D Print
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Popular 3D Printed Products
          </h2>
          <p className="text-zinc-400 text-sm">
            Everything is 3D printed with strong, vibrant filaments. Pick a category to browse:
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="p-5 rounded-2xl bg-studio-surface border border-white/10 hover:border-lime-400/50 hover:bg-white/5 transition-all duration-300 text-center flex flex-col items-center justify-center space-y-3 group shadow-subtle hover-lift"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-lime-500/20 text-zinc-300 group-hover:text-lime-400 border border-white/10 group-hover:border-lime-400/40 flex items-center justify-center transition-all">
                <Box className="w-6 h-6 transition-transform group-hover:scale-110" />
              </div>
              <div>
                <h3 className="font-semibold text-xs text-white group-hover:text-lime-400 transition-colors">
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

      {/* ============================================================== */}
      {/* 4. FEATURED PRODUCTS COLLECTION                                */}
      {/* ============================================================== */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-lime-400 font-bold">
              Customer Favorites
            </p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mt-1">
              Featured 3D Printed Items
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-lime-400 hover:text-lime-300 transition-colors"
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

      {/* ============================================================== */}
      {/* 5. HOW IT WORKS (SUPER SIMPLE 3 STEPS)                         */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-lime-400 font-bold">
            Super Simple Process
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            How Custom 3D Printing Works
          </h2>
          <p className="text-zinc-400 text-sm">
            Ordering a personalized 3D print is fast and easy:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-studio-surface border border-white/10 space-y-4 hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-lime-400/10 text-lime-400 font-mono font-bold text-lg flex items-center justify-center border border-lime-400/20">
              01
            </div>
            <h3 className="font-bold text-base text-white">Pick or Share an Idea</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Choose an existing design from our shop, or send us your own photo, sketch, or 3D file on WhatsApp.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-studio-surface border border-white/10 space-y-4 hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-lime-400/10 text-lime-400 font-mono font-bold text-lg flex items-center justify-center border border-lime-400/20">
              02
            </div>
            <h3 className="font-bold text-base text-white">Choose Colors & Add Your Text</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Personalize with your name, pick filament colors, and select your size. The price updates live on your screen.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-studio-surface border border-white/10 space-y-4 hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-lime-400/10 text-lime-400 font-mono font-bold text-lg flex items-center justify-center border border-lime-400/20">
              03
            </div>
            <h3 className="font-bold text-base text-white">We 3D Print It & Ship It</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We 3D print your piece layer-by-layer, perform a quality check, and ship it safely to your doorstep with live tracking.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. ABOUT VK STUDIO & VAMSI KRISHNA                             */}
      {/* ============================================================== */}
      <section id="about" className="relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-studio-surface border border-white/10 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-xs font-mono text-lime-400">
                  <Heart className="w-3.5 h-3.5 text-lime-400" />
                  <span>About VK STUDIO</span>
                </div>

                <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                  Independent 3D Printing by Vamsi Krishna
                </h2>

                <p className="text-zinc-300 text-sm leading-relaxed font-light">
                  Hi, I&apos;m Vamsi Krishna. I created <strong>VK STUDIO</strong> to make personalized 3D printing accessible and exciting for everyone.
                </p>

                <p className="text-zinc-300 text-sm leading-relaxed font-light">
                  <strong>We focus exclusively on 3D printed products.</strong> We do not do resin arts, epoxy crafts, or cheap mold casting. Every single product is individually 3D printed on high-precision 3D printers using strong, eco-friendly PLA and PETG filaments that last for years.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <h4 className="font-bold text-white text-xs flex items-center gap-2">
                      <Palette className="w-4 h-4 text-lime-400" />
                      Vibrant Filament Colors
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Silk glossy gold, matte black, marble finish, and dual-tone filaments.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <h4 className="font-bold text-white text-xs flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-lime-400" />
                      Clean & Durable
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      High-strength layer adhesion so your items are lightweight yet tough.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href="/custom-quote"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs shadow-subtle transition-all"
                  >
                    <span>Request Custom 3D Design</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href="https://instagram.com/vk_studi_o"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-all"
                  >
                    <span>Follow @vk_studi_o on Instagram</span>
                  </a>
                </div>
              </div>

              {/* Right Side: Visual Showcase Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-3xl p-6 bg-black/60 border border-white/15 space-y-4 text-center">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border border-white/20 mx-auto shadow-premium bg-black animate-float-subtle">
                    <img
                      src="/images/logo.jpg"
                      alt="VK STUDIO - Vamsi Krishna"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-display font-black text-lg text-white">VK STUDIO</h3>
                    <p className="text-xs text-lime-400 font-mono">Your Imagination, My Creation</p>
                  </div>

                  <div className="text-xs text-zinc-400 border-t border-white/10 pt-3 text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Founder / Maker:</span>
                      <strong className="text-white">Vamsi Krishna</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Specialization:</span>
                      <strong className="text-lime-400">Custom 3D Printing</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>WhatsApp Direct:</span>
                      <strong className="text-white">+91 91004 84870</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Instagram:</span>
                      <strong className="text-white">@vk_studi_o</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. VERIFIED CUSTOMER REVIEWS                                   */}
      {/* ============================================================== */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-lime-400 font-bold">
            Customer Feedback
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            What Customers Say About VK STUDIO
          </h2>
          <p className="text-zinc-400 text-sm">
            Read real feedback from people who ordered custom 3D prints, nameplates, and gifts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-studio-surface border border-white/10 flex flex-col justify-between space-y-4 shadow-subtle hover:border-lime-400/40 transition-all hover-lift"
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
                      Verified Order
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
                      className="text-[10px] text-lime-400 hover:underline block truncate max-w-[180px]"
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

      {/* ============================================================== */}
      {/* 8. WHATSAPP & CUSTOM 3D COMMISSION CALL TO ACTION               */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-zinc-950 via-studio-card to-zinc-950 border border-lime-400/30 p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-premium">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/20 text-xs font-mono text-lime-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Have a Specific 3D Idea or Design?</span>
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              Order Your Custom 3D Print Today
            </h2>
            <p className="text-zinc-300 text-sm font-normal">
              Send us a photo, drawing, or 3D file. We will tell you the exact price and 3D print it for you.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/custom-quote"
              className="px-8 py-4 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs tracking-wide shadow-subtle hover:shadow-glow hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              <span>Upload Custom 3D File / Idea</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                'Hello Vamsi Krishna! I have an idea for a custom 3D print. Can you give me an estimate?'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Discuss on WhatsApp (+91 91004 84870)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
