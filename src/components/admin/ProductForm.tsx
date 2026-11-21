'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  Layers,
  Sparkles,
  Save,
  Box,
} from 'lucide-react';
import { CustomizationFieldConfig, ProductType } from '@/lib/types';

interface ProductFormProps {
  initialProduct?: ProductType;
  isEditing?: boolean;
}

export default function ProductForm({ initialProduct, isEditing = false }: ProductFormProps) {
  const router = useRouter();

  // Basic Info
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [tagline, setTagline] = useState(initialProduct?.tagline || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || '');
  const [basePrice, setBasePrice] = useState(initialProduct?.basePrice?.toString() || '999');
  const [leadTimeDays, setLeadTimeDays] = useState(initialProduct?.leadTimeDays?.toString() || '3');
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

  // Materials & Colors
  const [materials, setMaterials] = useState<string[]>(() => {
    try {
      return initialProduct?.materials ? JSON.parse(initialProduct.materials) : ['Matte Architectural PLA', 'Ultra-Detail SLA Resin'];
    } catch {
      return ['Matte Architectural PLA'];
    }
  });
  const [newMaterial, setNewMaterial] = useState('');

  const [colors, setColors] = useState<Array<{ name: string; hex: string }>>(() => {
    try {
      return initialProduct?.colors ? JSON.parse(initialProduct.colors) : [
        { name: 'Matte Obsidian Black', hex: '#18181B' },
        { name: 'Brushed Silk Gold', hex: '#C5A880' },
      ];
    } catch {
      return [{ name: 'Matte Black', hex: '#18181B' }];
    }
  });
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#D97706');

  // Customization Fields Builder
  const [customFields, setCustomFields] = useState<CustomizationFieldConfig[]>(() => {
    try {
      return initialProduct?.customizationFields ? JSON.parse(initialProduct.customizationFields) : [];
    } catch {
      return [];
    }
  });

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

  // Add Custom Field
  const addCustomField = () => {
    const newField: CustomizationFieldConfig = {
      id: `field_${Date.now()}`,
      name: `custom_field_${customFields.length + 1}`,
      label: 'New Custom Option',
      type: 'text',
      isRequired: false,
      priceModifier: 0,
      options: [],
    };
    setCustomFields([...customFields, newField]);
  };

  const updateCustomField = (index: number, updates: Partial<CustomizationFieldConfig>) => {
    const updated = [...customFields];
    updated[index] = { ...updated[index], ...updates };
    setCustomFields(updated);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const addOptionToField = (fieldIndex: number) => {
    const field = customFields[fieldIndex];
    const currentOptions = field.options || [];
    const newOpt = {
      label: `Option ${currentOptions.length + 1}`,
      value: `option_${currentOptions.length + 1}`,
      priceModifier: 0,
    };
    updateCustomField(fieldIndex, { options: [...currentOptions, newOpt] });
  };

  const updateOption = (fieldIndex: number, optionIndex: number, updates: any) => {
    const field = customFields[fieldIndex];
    const opts = [...(field.options || [])];
    opts[optionIndex] = { ...opts[optionIndex], ...updates };
    updateCustomField(fieldIndex, { options: opts });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const field = customFields[fieldIndex];
    const opts = (field.options || []).filter((_, i) => i !== optionIndex);
    updateCustomField(fieldIndex, { options: opts });
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !slug || !description || !basePrice || !categoryId) {
      setError('Name, slug, description, base price, and category are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        slug,
        tagline,
        description,
        categoryId,
        basePrice: parseFloat(basePrice),
        leadTimeDays: parseInt(leadTimeDays || '3'),
        dimensions,
        weight,
        model3dType,
        isAvailable,
        isFeatured,
        images: JSON.stringify(images),
        materials: JSON.stringify(materials),
        colors: JSON.stringify(colors),
        customizationFields: JSON.stringify(customFields),
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
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{submitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* 1. Basic Details */}
      <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4 text-xs">
        <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold flex items-center gap-2">
          <Box className="w-4 h-4" />
          <span>1. General Product Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-zinc-300 font-medium block mb-1">Product Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Articulated Cybernetic Dragon"
              value={name}
              onChange={handleNameChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">URL Slug *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-zinc-300 font-medium block mb-1">Tagline / Short Summary</label>
            <input
              type="text"
              placeholder="e.g. Print-in-place fluid kinetic sculpture with multi-axis vertebrae"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-zinc-300 font-medium block mb-1">Full Description *</label>
            <textarea
              rows={4}
              required
              placeholder="Detailed description of slicing specifications, finish, infill, and inspiration..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-studio-card border border-white/10 text-white outline-none focus:border-amber-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">Starting Base Price (₹) *</label>
            <input
              type="number"
              required
              min="0"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">Lead Time (Business Days)</label>
            <input
              type="number"
              min="1"
              value={leadTimeDays}
              onChange={(e) => setLeadTimeDays(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">3D CAD Interactive Model Type</label>
            <select
              value={model3dType}
              onChange={(e) => setModel3dType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-studio-card border border-white/10 text-white outline-none focus:border-amber-500"
            >
              <option value="geometric">Geometric Precision Lattice</option>
              <option value="dragon">Articulated Kinetic Dragon</option>
              <option value="lamp">Voronoi Ambient Lamp</option>
              <option value="nameplate">Architectural Slab Nameplate</option>
              <option value="stand">Ergonomic Docking Stand</option>
              <option value="planter">Parametric Faceted Planter</option>
              <option value="keycap">Resin Artisan Keycap</option>
            </select>
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">Dimensions (e.g. 150 x 80 x 60 mm)</label>
            <input
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">Estimated Finished Weight</label>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-white/5 border-white/10"
              />
              <span>In Stock & Available to Order</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-white/5 border-white/10"
              />
              <span>Feature on Homepage Signature Works</span>
            </label>
          </div>
        </div>
      </div>

      {/* 2. Images Management */}
      <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4 text-xs">
        <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold flex items-center gap-2">
          <Upload className="w-4 h-4" />
          <span>2. Product Photography & Gallery</span>
        </h3>

        {/* Existing Images */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-square">
              <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Upload or Add Image URL */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <label className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white cursor-pointer font-medium flex items-center justify-center gap-2 self-start">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
            <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
          </label>

          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Or paste external image URL..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={() => {
                if (newImageUrl.trim()) {
                  setImages([...images, newImageUrl.trim()]);
                  setNewImageUrl('');
                }
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white font-medium"
            >
              Add URL
            </button>
          </div>
        </div>
      </div>

      {/* 3. Materials and Colors */}
      <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-6 text-xs">
        <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span>3. Material Compounds & Color Swatches</span>
        </h3>

        {/* Materials */}
        <div className="space-y-2">
          <label className="text-zinc-300 font-medium block">Available Materials / Filaments:</label>
          <div className="flex flex-wrap gap-2">
            {materials.map((mat, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-200"
              >
                <span>{mat}</span>
                <button
                  type="button"
                  onClick={() => setMaterials(materials.filter((_, i) => i !== idx))}
                  className="text-zinc-500 hover:text-red-400"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-sm pt-1">
            <input
              type="text"
              placeholder="e.g. Carbon Fiber PETG"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={() => {
                if (newMaterial.trim()) {
                  setMaterials([...materials, newMaterial.trim()]);
                  setNewMaterial('');
                }
              }}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white"
            >
              Add
            </button>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <label className="text-zinc-300 font-medium block">Color Swatches:</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((c, idx) => (
              <span
                key={idx}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-200"
              >
                <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                <span>{c.name}</span>
                <button
                  type="button"
                  onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                  className="text-zinc-500 hover:text-red-400 ml-1"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-md pt-1">
            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
            />
            <input
              type="text"
              placeholder="Color name (e.g. Emerald Silk)"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={() => {
                if (newColorName.trim()) {
                  setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
                  setNewColorName('');
                }
              }}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white"
            >
              Add Swatch
            </button>
          </div>
        </div>
      </div>

      {/* 4. Dynamic Customization Fields Builder */}
      <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-6 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>4. Dynamic Customization Field Builder</span>
            </h3>
            <p className="text-zinc-400 text-[11px] mt-0.5">
              Configure what customers can customize for this specific product (e.g. Custom Name, Scale Variant, Inlay Finish, Reference Photo).
            </p>
          </div>

          <button
            type="button"
            onClick={addCustomField}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Field</span>
          </button>
        </div>

        {customFields.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 bg-white/5 rounded-xl border border-white/5">
            No customization fields configured for this product yet. Click &quot;Add Field&quot; to configure custom text, dropdowns, or file uploads.
          </div>
        ) : (
          <div className="space-y-4">
            {customFields.map((field, fIdx) => (
              <div
                key={field.id}
                className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-mono font-bold text-amber-400 text-xs">
                    Field #{fIdx + 1} ({field.type.toUpperCase()})
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCustomField(fIdx)}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-zinc-300 font-medium block mb-1">Field Label *</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateCustomField(fIdx, { label: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-medium block mb-1">Input Type</label>
                    <select
                      value={field.type}
                      onChange={(e) => updateCustomField(fIdx, { type: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-studio-card border border-white/10 text-white outline-none focus:border-amber-500"
                    >
                      <option value="text">Single-line Text Input</option>
                      <option value="select">Dropdown Select</option>
                      <option value="radio">Radio Options Buttons</option>
                      <option value="textarea">Multi-line Textarea</option>
                      <option value="file">File / CAD Upload</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-300 font-medium block mb-1">Base Price Modifier (+₹)</label>
                    <input
                      type="number"
                      value={field.priceModifier || 0}
                      onChange={(e) => updateCustomField(fIdx, { priceModifier: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-zinc-300 font-medium block mb-1">Placeholder / Help Text</label>
                    <input
                      type="text"
                      value={field.placeholder || field.helpText || ''}
                      onChange={(e) => updateCustomField(fIdx, { placeholder: e.target.value, helpText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                      <input
                        type="checkbox"
                        checked={field.isRequired ?? false}
                        onChange={(e) => updateCustomField(fIdx, { isRequired: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500 bg-white/5 border-white/10"
                      />
                      <span>Required Field</span>
                    </label>
                  </div>
                </div>

                {/* Options Builder for Select and Radio */}
                {(field.type === 'select' || field.type === 'radio') && (
                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 font-mono text-[11px]">Dropdown / Radio Choices:</span>
                      <button
                        type="button"
                        onClick={() => addOptionToField(fIdx)}
                        className="text-amber-400 hover:text-amber-300 text-[11px] font-semibold"
                      >
                        + Add Choice
                      </button>
                    </div>

                    <div className="space-y-2">
                      {field.options?.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Option Label (e.g. Grand 55cm)"
                            value={opt.label}
                            onChange={(e) => updateOption(fIdx, oIdx, { label: e.target.value, value: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_') })}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none text-xs"
                          />
                          <input
                            type="number"
                            placeholder="Price (+₹)"
                            value={opt.priceModifier || 0}
                            onChange={(e) => updateOption(fIdx, oIdx, { priceModifier: parseFloat(e.target.value) || 0 })}
                            className="w-24 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono outline-none text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(fIdx, oIdx)}
                            className="p-1.5 text-zinc-500 hover:text-red-400"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Link
          href="/admin/products"
          className="px-5 py-2.5 rounded-xl bg-white/5 text-zinc-300 font-medium text-xs"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-subtle hover:shadow-glow transition-all"
        >
          {submitting ? 'Saving Product...' : isEditing ? 'Save Product Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
