import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailClient from '@/components/ProductDetailClient';
import { ProductType, ReviewType } from '@/lib/types';

export const revalidate = 0;

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = params;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    include: {
      category: true,
      reviews: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isAvailable: true,
    },
    take: 3,
  });

  const totalReviews = product.reviews.length;
  const averageRating =
    totalReviews > 0
      ? Number((product.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
      : 5.0;

  const enrichedProduct = {
    ...product,
    totalReviews,
    averageRating,
  } as unknown as ProductType;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ProductDetailClient
        product={enrichedProduct}
        reviews={product.reviews as unknown as ReviewType[]}
        relatedProducts={relatedProducts as unknown as ProductType[]}
      />
    </div>
  );
}
