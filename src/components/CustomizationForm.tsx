'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ShoppingBag,
  MessageCircle,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CustomizationFieldConfig, ProductType } from '@/lib/types';

interface CustomizationFormProps {
  product: ProductType;
}

export default function CustomizationForm({ product }: CustomizationFormProps) {
  const router = useRouter();
  const { addToCart, getWhatsAppShareUrl } = useCart();

  // Parse configurations
  const customizationFields: CustomizationFieldConfig[] = useMemo(() => {
    try {
      return JSON.parse(product.customizationFields || '[]');
    } catch {
      return [];
    }
  }, [product.customizationFields]);

  const materials: string[] = useMemo(() => {
    try {
      return JSON.parse(product.materials || '[]');
    } catch {
      return ['Matte High-Quality PLA', 'Durable Tough PETG Filament'];
    }
  }, [product.materials]);

  const colors: Array<{ name: string; hex: string }> = useMemo(() => {
    try {
      return JSON.parse(product.colors || '[]');
    } catch {
      return [
        { name: 'Matte Obsidian Black', hex: '#18181B' },
        { name: 'Brushed Silk Gold', hex: '#C5A880' },
      ];
    }
  }, [product.colors]);

  // Form State
  const [selectedMaterial, setSelectedMaterial] = useState<string>(materials[0] || 'Standard PLA');
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]?.name || 'Matte Black');
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [requestQuoteModal, setRequestQuoteModal] = useState<boolean>(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState<boolean>(false);
  const [quoteSuccess, setQuoteSuccess] = useState<string | null>(null);

  // Quote form state
  const [quoteName, setQuoteName] = useState<string>('');
  const [quoteEmail, setQuoteEmail] = useState<string>('');
  const [quotePhone, setQuotePhone] = useState<string>('');

  // Calculate live dynamic price modifications
  const customizationPrice = useMemo(() => {
    let extra = 0;
    customizationFields.forEach((field) => {
      const val = fieldValues[field.id];
      if (!val) return;

      if (field.type === 'select' || field.type === 'radio') {
        const chosenOption = field.options?.find((opt) => opt.value === val);
        if (chosenOption && chosenOption.priceModifier) {
          extra += chosenOption.priceModifier;
        }
      } else if (field.priceModifier) {
        // Text field with price modifier if not empty
        if (typeof val === 'string' && val.trim().length > 0) {
          extra += field.priceModifier;
        }
      }
    });
    return extra;
  }, [customizationFields, fieldValues]);

  const unitTotal = product.basePrice + customizationPrice;
  const grandTotal = unitTotal * quantity;

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setUploadedFileUrl(data.url);
        setFieldValues((prev) => ({
          ...prev,
          reference_file: data.url,
        }));
      } else {
        alert(data.error || 'Failed to upload file');
      }
    } catch (err: any) {
      alert(err.message || 'File upload error');
    } finally {
      setUploading(false);
    }
  };

  // Validate required inputs
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    customizationFields.forEach((field) => {
      if (field.isRequired) {
        const val = fieldValues[field.id];
        if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
          errors[field.id] = `${field.label} is required`;
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add to Cart
  const handleAddToCart = async () => {
    if (!validate()) return;

    setAddingToCart(true);
    const completeCustomization = {
      material: selectedMaterial,
      color: selectedColor,
      ...fieldValues,
      ...(uploadedFileUrl ? { reference_file_url: uploadedFileUrl } : {}),
      ...(specialInstructions.trim() ? { special_instructions: specialInstructions } : {}),
    };

    try {
      await addToCart(
        product,
        quantity,
        completeCustomization,
        product.basePrice,
        customizationPrice
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // Submit Bespoke Quote Request
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteName || !quoteEmail) {
      alert('Please provide your name and email');
      return;
    }

    setQuoteSubmitting(true);
    const completeCustomization = {
      material: selectedMaterial,
      color: selectedColor,
      ...fieldValues,
    };

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: quoteName,
          customerEmail: quoteEmail,
          customerPhone: quotePhone,
          productId: product.id,
          productTitle: product.name,
          customizationDetails: completeCustomization,
          customerInstructions: specialInstructions,
          referenceFileUrl: uploadedFileUrl,
          quantity,
          estimatedPrice: grandTotal,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setQuoteSuccess(data.request.referenceNumber);
      } else {
        alert(data.error || 'Failed to submit quote');
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting quote');
    } finally {
      setQuoteSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Price Display Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-studio-card via-zinc-900 to-studio-card border border-amber-500/30 shadow-subtle flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400 block">
            Live Configured Price
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-extrabold text-amber-400">
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
            {customizationPrice > 0 && (
              <span className="text-xs text-zinc-400 font-mono">
                (Base: ₹{product.basePrice} + Custom: ₹{customizationPrice})
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Estimated Slicing: {product.leadTimeDays} Days</span>
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end mt-0.5">
            <CheckCircle className="w-3 h-3" />
            Made to order
          </span>
        </div>
      </div>

      {/* Material Selection */}
      <div className="space-y-2.5">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-amber-500" />
          <span>Select Fabrication Filament / Material:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {materials.map((mat) => (
            <button
              key={mat}
              type="button"
              onClick={() => setSelectedMaterial(mat)}
              className={`p-3 rounded-xl text-left border text-xs transition-all ${
                selectedMaterial === mat
                  ? 'bg-amber-500/10 border-amber-500 text-white shadow-subtle'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="font-semibold">{mat}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Industrial grade tolerance</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Swatch Selection */}
      <div className="space-y-2.5">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold flex items-center justify-between">
          <span>Filament Color Tone:</span>
          <span className="text-amber-400 text-xs font-semibold">{selectedColor}</span>
        </label>
        <div className="flex flex-wrap gap-2.5">
          {colors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setSelectedColor(c.name)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                selectedColor === c.name
                  ? 'bg-white/15 border-amber-500 text-white shadow-subtle scale-105'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner"
                style={{ backgroundColor: c.hex }}
              />
              <span className="font-medium text-[11px]">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamically Rendered Product Fields */}
      {customizationFields.length > 0 && (
        <div className="pt-2 border-t border-white/10 space-y-4">
          <p className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Customization Options</span>
          </p>

          {customizationFields.map((field) => {
            const hasError = validationErrors[field.id];

            return (
              <div key={field.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-200">
                    {field.label}{' '}
                    {field.isRequired ? (
                      <span className="text-amber-500">*</span>
                    ) : (
                      <span className="text-zinc-500 text-[10px]">(Optional)</span>
                    )}
                  </label>
                  {field.priceModifier && field.priceModifier > 0 && (
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      +₹{field.priceModifier}
                    </span>
                  )}
                </div>

                {field.helpText && (
                  <p className="text-[11px] text-zinc-400">{field.helpText}</p>
                )}

                {/* Text Field */}
                {field.type === 'text' && (
                  <input
                    type="text"
                    placeholder={field.placeholder || 'Type custom text...'}
                    value={fieldValues[field.id] || ''}
                    onChange={(e) =>
                      setFieldValues({ ...fieldValues, [field.id]: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 ${
                      hasError ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                )}

                {/* Textarea Field */}
                {field.type === 'textarea' && (
                  <textarea
                    rows={2}
                    placeholder={field.placeholder || 'Enter details...'}
                    value={fieldValues[field.id] || ''}
                    onChange={(e) =>
                      setFieldValues({ ...fieldValues, [field.id]: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 ${
                      hasError ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                )}

                {/* Select Dropdown */}
                {field.type === 'select' && (
                  <select
                    value={fieldValues[field.id] || ''}
                    onChange={(e) =>
                      setFieldValues({ ...fieldValues, [field.id]: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-studio-card border text-sm text-white focus:outline-none focus:border-amber-500 ${
                      hasError ? 'border-red-500' : 'border-white/10'
                    }`}
                  >
                    <option value="">-- Choose {field.label} --</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}{' '}
                        {opt.priceModifier
                          ? opt.priceModifier > 0
                            ? `(+₹${opt.priceModifier})`
                            : `(-₹${Math.abs(opt.priceModifier)})`
                          : ''}
                      </option>
                    ))}
                  </select>
                )}

                {/* Radio Buttons */}
                {field.type === 'radio' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {field.options?.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setFieldValues({ ...fieldValues, [field.id]: opt.value })
                        }
                        className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                          fieldValues[field.id] === opt.value
                            ? 'bg-amber-500/15 border-amber-500 text-white font-semibold'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div>{opt.label}</div>
                        {opt.priceModifier ? (
                          <div className="text-[10px] text-amber-400 mt-0.5">
                            +{opt.priceModifier > 0 ? `₹${opt.priceModifier}` : `-₹${Math.abs(opt.priceModifier)}`}
                          </div>
                        ) : null}
                      </button>
                    ))}
                  </div>
                )}

                {/* File Upload for Lithophanes / Custom Models */}
                {field.type === 'file' && (
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-white/15 hover:border-amber-500/50 cursor-pointer bg-white/5 transition-all text-center">
                      <Upload className="w-5 h-5 text-amber-400 mb-1" />
                      <span className="text-xs text-white font-medium">
                        {uploadedFileUrl ? 'File Uploaded (Click to change)' : 'Click to Upload Reference File'}
                      </span>
                      <span className="text-[10px] text-zinc-500 mt-0.5">
                        Accepts JPG, PNG, STL, OBJ, STEP, PDF (Max 25MB)
                      </span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,.stl,.obj,.step,.pdf"
                      />
                    </label>

                    {uploading && (
                      <p className="text-xs text-amber-400 animate-pulse">Uploading file to studio server...</p>
                    )}

                    {uploadedFileUrl && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="truncate max-w-xs">{uploadedFileUrl}</span>
                      </div>
                    )}
                  </div>
                )}

                {hasError && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{hasError}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Special Instructions */}
      <div className="space-y-1.5 pt-2 border-t border-white/10">
        <label className="text-xs font-semibold text-zinc-300">
          Special Studio Instructions / Infill Preferences (Optional):
        </label>
        <textarea
          rows={2}
          placeholder="e.g. Please print with 25% gyroid infill for extra rigidity, or pack in gift wrapping..."
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold">
          Batch Quantity:
        </span>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center font-bold text-sm"
          >
            -
          </button>
          <span className="w-8 text-center font-mono font-bold text-white text-sm">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center font-bold text-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* Order Actions */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        {/* Primary Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-subtle hover:shadow-glow transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{addingToCart ? 'Configuring & Adding...' : `Add to Cart • ₹${grandTotal.toLocaleString('en-IN')}`}</span>
        </button>

        {/* Secondary: Request Custom Quote */}
        <button
          type="button"
          onClick={() => setRequestQuoteModal(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-200 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-all"
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Request Bespoke Studio Quote (Bulk / CAD Modifications)</span>
        </button>
      </div>

      {/* Custom Quote Modal */}
      {requestQuoteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-studio-card border border-white/15 rounded-2xl shadow-premium p-6 space-y-4">
            {quoteSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Custom Quote Requested!</h3>
                <p className="text-xs text-zinc-300">
                  Your reference ID is <strong className="text-amber-400 font-mono">{quoteSuccess}</strong>.
                  Our CAD engineers will analyze your slicing tolerances and reply within 4 business hours.
                </p>
                <button
                  onClick={() => {
                    setQuoteSuccess(null);
                    setRequestQuoteModal(false);
                  }}
                  className="mt-4 px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Request Studio Quote</h3>
                    <p className="text-xs text-zinc-400">For {product.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRequestQuoteModal(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-zinc-300 font-medium block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={quoteName}
                      onChange={(e) => setQuoteName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-medium block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. vikram@example.com"
                      value={quoteEmail}
                      onChange={(e) => setQuoteEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-medium block mb-1">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={quotePhone}
                      onChange={(e) => setQuotePhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Configured Specs Included in Quote:
                    </span>
                    <p className="text-white text-[11px]">
                      Material: {selectedMaterial} • Color: {selectedColor} • Qty: {quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRequestQuoteModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={quoteSubmitting}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs disabled:opacity-50"
                  >
                    {quoteSubmitting ? 'Submitting CAD...' : 'Submit Studio Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
