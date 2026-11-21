import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';
import { ProductType } from '@/lib/types';

export const revalidate = 0;

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl text-white tracking-tight">
          Edit &quot;{product.name}&quot;
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Update prices, lead times, materials, or dynamic customization options.
        </p>
      </div>

      <ProductForm initialProduct={product as unknown as ProductType} isEditing={true} />
    </div>
  );
}
