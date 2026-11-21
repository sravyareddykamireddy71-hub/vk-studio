import React from 'react';
import ProductForm from '@/components/admin/ProductForm';

export const revalidate = 0;

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl text-white tracking-tight">
          Create New 3D Creation
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Define product specifications, upload imagery, and configure custom CAD fields.
        </p>
      </div>

      <ProductForm isEditing={false} />
    </div>
  );
}
