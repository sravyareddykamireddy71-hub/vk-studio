'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Trash2,
  Upload,
  Sparkles,
  Save,
  Box,
  Clock,
  Tag,
  MessageCircle,
} from 'lucide-react';
import { ProductType } from '@/lib/types';

interface ProductFormProps {
  initialProduct?: ProductType;
  isEditing?: boolean;
}

export default function ProductForm({ initialProduct, isEditing = false }: ProductFormProps) {
  const router = useRouter();

  // Basic Product Info
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [tagline, setTagline] = useState(initialProduct?.tagline || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || '');
  const [basePrice, setBasePrice] = useState(initialProduct?.basePrice?.toString() || '999');
  const [leadTimeDays, setLeadTimeDays] = useState(initialProduct?.leadTimeDays?.toString() || '4');
  const [dimensions, setDimensions] = useState(initialProduct?.dimensions || '');
  const [weight, setWeight] = useState(initialProduct?.weight || '');
  const [model3dType, setModel3dType] = useState(initialProduct?.model3dType || 'geometric');
  const [isAvailable, setIsAvailable] = useState(initialProduct?.isAvailable ?? true);
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured ?? false);

  // Categories list
  const [categories, setCategories] = useState<any[]>([]);

  // Images list
  const [images, setImages] = useState<string[]>(() => {
    try {
      return initialProduct?.images ? JSON.parse(initialProduct.images) : [];
    } catch {
      return ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'];
    }
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || []);
        if (!categoryId && data.categories?.length > 0) {
          setCategoryId(data.categories[0].id);
        }
      })
      .catch(console.error);
  }, [categoryId]);

  // Auto-slugify name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  // Upload handler for product image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setImages((prev) => [...prev, data.url]);
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err: any) {
      alert(err.message || 'Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !slug.trim() || !description.trim() || basePrice === '' || !categoryId) {
      setError('Name, slug, description, base price, and category are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        categoryId,
        basePrice: parseFloat(basePrice) || 0,
        leadTimeDays: parseInt(leadTimeDays || '4'),
        dimensions: dimensions.trim(),
        weight: weight.trim(),
        model3dType,
        isAvailable,
        isFeatured,
        images: JSON.stringify(images),
        materials: initialProduct?.materials || JSON.stringify(['Matte Premium PLA', 'Durable Tough PETG']),
        colors: initialProduct?.colors || JSON.stringify([]),
        customizationFields: JSON.stringify([]), // Simplified: customization handled via WhatsApp
      };

      const url = isEditing && initialProduct ? `/api/products/${initialProduct.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save product');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl pb-16">
      {/* Top action bar */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/10 pb-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-lime-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

      {/* 1. Basic Product Information */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-studio-surface border border-zinc-200 dark:border-white/10 space-y-6 text-xs shadow-sm">
        <h3 className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-lime-400 font-bold flex items-center gap-2">
          <Tag className="w-4 h-4" />
          <span>1. Product Details & Pricing</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Personalized Dual-Tone Lithophane Photo Lamp"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white outline-none focus:border-emerald-600 dark:focus:border-lime-400"
            />
          </div>

          <div>
            <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white font-mono outline-none focus:border-emerald-600 dark:focus:border-lime-400"
            />
          </div>

          <div>
            <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-studio-card border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white outline-none focus:border-emerald-600 dark:focus:border-lime-400"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
              Tagline (Short Subtitle)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Warm LED backlight with high-contrast 3D micro-relief carving"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white outline-none focus:border-emerald-600 dark:focus:border-lime-400"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
              Full Description *
            </label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the 3D printed piece, design qualities, dimensions, and craftsmanship..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white outline-none focus:border-emerald-600 dark:focus:border-lime-400"
            />
          </div>

          <div>
            <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
              Listed Price (₹) * (Set 0 for &quot;Price on Request&quot;)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white font-mono outline-none focus:border-emerald-600 dark:focus:border-lime-400"
            />
          </div>

          <div>
            <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
              Preparation Time (Days) — VK Studio Min. 4 Days
            </label>
            <input
              type="number"
              min="1"
              value={leadTimeDays}
              onChange={(e) => setLeadTimeDays(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white font-mono outline-none focus:border-emerald-600 dark:focus:border-lime-400"
            />
          </div>

          <div>
            <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
              Dimensions (e.g. 150 x 80 x 60 mm)
            </label>
            <input
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g. 150 x 80 x 60 mm"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white outline-none focus:border-emerald-600 dark:focus:border-lime-400"
            />
          </div>

          <div>
            <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
              Finished Weight
            </label>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 120 grams"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white outline-none focus:border-emerald-600 dark:focus:border-lime-400"
            />
          </div>

          <div>
            <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
              Interactive 3D CAD Preview Shape
            </label>
            <select
              value={model3dType}
              onChange={(e) => setModel3dType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-studio-card border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white outline-none focus:border-emerald-600 dark:focus:border-lime-400"
            >
              <option value="geometric">Geometric Precision Lattice</option>
              <option value="dragon">Articulated Kinetic Dragon</option>
              <option value="lamp">Voronoi Ambient Lamp</option>
              <option value="nameplate">Architectural Slab Nameplate</option>
              <option value="stand">Ergonomic Docking Stand</option>
              <option value="planter">Parametric Faceted Planter</option>
              <option value="keycap">3D Printed Custom Keycap</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-800 dark:text-zinc-200 font-medium">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-lime-500 bg-white/5 border-zinc-300"
              />
              <span>In Stock & Available to Order</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-zinc-800 dark:text-zinc-200 font-medium">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-lime-500 bg-white/5 border-zinc-300"
              />
              <span>Feature on Homepage Favorites</span>
            </label>
          </div>
        </div>
      </div>

      {/* 2. Product Photography Gallery */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-studio-surface border border-zinc-200 dark:border-white/10 space-y-4 text-xs shadow-sm">
        <h3 className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-lime-400 font-bold flex items-center gap-2">
          <Upload className="w-4 h-4" />
          <span>2. Product Photography Gallery</span>
        </h3>

        {/* Existing Images */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 aspect-square bg-zinc-100 dark:bg-black/40">
              <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Upload or Add Image URL */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <label className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 border border-zinc-300 dark:border-white/15 text-zinc-900 dark:text-white cursor-pointer font-semibold flex items-center justify-center gap-2 self-start transition-colors">
            <Upload className="w-4 h-4 text-emerald-600 dark:text-lime-400" />
            <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
            <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
          </label>

          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Or paste external image URL..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white outline-none focus:border-emerald-600 dark:focus:border-lime-400"
            />
            <button
              type="button"
              onClick={() => {
                if (newImageUrl.trim()) {
                  setImages([...images, newImageUrl.trim()]);
                  setNewImageUrl('');
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold"
            >
              Add URL
            </button>
          </div>
        </div>
      </div>

      {/* 3. WhatsApp Customization Notice */}
      <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200 text-xs flex items-center gap-3">
        <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-lime-400 flex-shrink-0" />
        <p className="leading-relaxed">
          <strong>Direct WhatsApp Customization:</strong> Customers will discuss custom dimensions, names, colors, and urgent orders with you directly on WhatsApp. Complicated configuration forms and formulas are removed.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-2">
        <Link
          href="/admin/products"
          className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all"
        >
          {submitting ? 'Saving Product...' : isEditing ? 'Save Product Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
