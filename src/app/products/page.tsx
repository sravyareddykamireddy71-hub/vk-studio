import React from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Box, Sparkles } from 'lucide-react';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import { ProductType } from '@/lib/types';

export const revalidate = 0;

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, search, sort } = searchParams;

  const [categories, productsRaw] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    }),
    prisma.product.findMany({
      where: {
        isAvailable: true,
        ...(category && category !== 'all' ? { category: { slug: category } } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { description: { contains: search } },
                { tagline: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        category: true,
        reviews: { where: { isPublished: true } },
      },
      orderBy:
        sort === 'price-low'
          ? { basePrice: 'asc' }
          : sort === 'price-high'
          ? { basePrice: 'desc' }
          : { createdAt: 'desc' },
    }),
  ]);

  const products = productsRaw.map((p) => {
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
  }) as unknown as ProductType[];

  const currentCategory = categories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="border-b border-zinc-200 dark:border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-lime-400/10 border border-emerald-500/20 dark:border-lime-400/20 text-xs font-mono text-emerald-700 dark:text-lime-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VK STUDIO 3D Catalog</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-950 dark:text-white tracking-tight">
            {currentCategory ? currentCategory.name : 'Explore All 3D Printed Items'}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-xl">
            {currentCategory?.description ||
              'Explore our curated catalog of custom 3D-printed nameplates, phone stands, personalized lithophane lamps, and unique gifts.'}
          </p>
        </div>

        {/* Stats */}
        <div className="text-right">
          <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Showing <strong className="text-zinc-950 dark:text-white font-bold">{products.length}</strong> items
          </span>
        </div>
      </div>

      {/* Filter and Category Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Categories Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <Link
            href="/products"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              !category || category === 'all'
                ? 'bg-lime-500 text-black shadow-sm'
                : 'bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}${sort ? `&sort=${sort}` : ''}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                category === cat.slug
                  ? 'bg-lime-500 text-black shadow-sm'
                  : 'bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              {cat.name} ({cat._count.products})
            </Link>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">Sort:</span>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl text-xs text-zinc-300">
            <Link
              href={`/products?${category ? `category=${category}&` : ''}sort=newest`}
              className={`px-2.5 py-1 rounded-lg ${
                !sort || sort === 'newest' ? 'bg-white/15 text-white font-semibold' : 'hover:text-white'
              }`}
            >
              Newest
            </Link>
            <Link
              href={`/products?${category ? `category=${category}&` : ''}sort=price-low`}
              className={`px-2.5 py-1 rounded-lg ${
                sort === 'price-low' ? 'bg-white/15 text-white font-semibold' : 'hover:text-white'
              }`}
            >
              Price: Low to High
            </Link>
            <Link
              href={`/products?${category ? `category=${category}&` : ''}sort=price-high`}
              className={`px-2.5 py-1 rounded-lg ${
                sort === 'price-high' ? 'bg-white/15 text-white font-semibold' : 'hover:text-white'
              }`}
            >
              Price: High to Low
            </Link>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="py-20 text-center space-y-4 rounded-3xl bg-studio-surface border border-white/10 p-12">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
            <Box className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No creations found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            We couldn&apos;t find any 3D products matching your current filters. Try selecting another category or requesting a custom piece.
          </p>
          <div className="pt-2">
            <Link
              href="/custom-quote"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white font-medium text-xs"
            >
              Request Custom 3D Commission
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
