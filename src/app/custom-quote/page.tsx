'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Upload,
  FileCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageCircle,
  Layers,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CustomQuotePage() {
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [projectTitle, setProjectTitle] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [material, setMaterial] = useState('Matte Engineering PLA');
  const [color, setColor] = useState('Matte Obsidian Black');
  const [infill, setInfill] = useState('20% Gyroid (Balanced)');
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFileUrl(data.url);
        setFileName(data.filename || file.name);
      } else {
        setError(data.error || 'Failed to upload file');
      }
    } catch (err: any) {
      setError(err.message || 'File upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName || !customerEmail) {
      setError('Name and Email are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          productTitle: projectTitle || 'Custom Bespoke Commission',
          customizationDetails: {
            dimensions,
            material,
            color,
            infill,
          },
          customerInstructions: instructions,
          referenceFileUrl: fileUrl,
          quantity,
          estimatedPrice: 1500 * quantity,
        }),
      });

      const data = await res.json();
      if (res.ok && data.request) {
        setSubmittedRef(data.request.referenceNumber);
      } else {
        setError(data.error || 'Failed to submit commission request');
      }
    } catch (err: any) {
      setError(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedRef) {
    const whatsappMsg = encodeURIComponent(
      `*Hello VK STUDIO!* 👋\n\nI just submitted a Bespoke 3D Commission request on your platform.\n\n*Reference ID:* ${submittedRef}\n*Name:* ${customerName}\n*Material:* ${material}\n*Quantity:* ${quantity}\n\nLooking forward to your CAD analysis and quotation. Thank you!`
    );

    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-subtle">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
            Request Logged in Studio Database
          </span>
          <h1 className="font-display font-black text-3xl text-white tracking-tight">
            Commission Request Received!
          </h1>
          <p className="text-xs text-zinc-300 max-w-md mx-auto">
            Your unique studio tracking code is:
          </p>
          <div className="p-3 rounded-xl bg-studio-surface border border-amber-500/40 inline-block font-mono text-xl font-bold text-amber-400 tracking-wider">
            {submittedRef}
          </div>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto pt-2">
            Our slicing engineers review all models for overhangs, wall thicknesses, and print orientation within 4 business hours.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <a
            href={`https://wa.me/919876543210?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-subtle transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Discuss on WhatsApp ({submittedRef})</span>
          </a>

          <Link
            href="/profile"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs flex items-center justify-center gap-2"
          >
            <span>View in My Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="border-b border-white/10 pb-6 space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bespoke 3D Fabrication Atelier</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
          Request a Custom 3D Commission
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
          Bring your own CAD files, architectural models, or concept sketches to life. We inspect your geometry, optimize support scaffolding, and provide an accurate quote and turnaround estimate.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* 1. File Upload */}
        <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>1. Upload 3D Model or Reference Files (STL, OBJ, STEP, 3MF, PDF, JPG)</span>
          </h3>

          <div className="relative">
            <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/15 hover:border-amber-500/50 cursor-pointer bg-black/30 hover:bg-white/5 transition-all text-center group">
              <Upload className="w-8 h-8 text-amber-400 mb-2 transition-transform group-hover:scale-110" />
              <span className="text-sm font-semibold text-white">
                {fileName ? fileName : 'Click or Drag & Drop Model Files Here'}
              </span>
              <span className="text-xs text-zinc-500 mt-1">
                Accepts .STL, .OBJ, .STEP, .3MF, .PDF, .JPG, .PNG (Up to 25MB)
              </span>
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".stl,.obj,.step,.3mf,.pdf,image/*"
              />
            </label>

            {uploading && (
              <div className="absolute inset-0 bg-black/80 rounded-2xl flex items-center justify-center">
                <span className="text-xs font-mono text-amber-400 animate-pulse">
                  Uploading geometry to studio server...
                </span>
              </div>
            )}
          </div>

          {fileUrl && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              <span className="font-mono truncate">{fileName || fileUrl}</span>
            </div>
          )}
        </div>

        {/* 2. Specifications */}
        <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4 text-xs">
          <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>2. Fabrication Specifications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-300 font-medium block mb-1">Project / Model Title</label>
              <input
                type="text"
                placeholder="e.g. Architectural Elevation Model #4"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-medium block mb-1">Target Dimensions (L x W x H mm)</label>
              <input
                type="text"
                placeholder="e.g. 150 x 120 x 85 mm"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-medium block mb-1">Preferred Filament / Compound</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-studio-card border border-white/10 text-white outline-none focus:border-amber-500"
              >
                <option value="Matte Engineering PLA">Matte Architectural PLA</option>
                <option value="Carbon Fiber Reinforced PETG">Carbon Fiber Reinforced PETG</option>
                <option value="High-Detail SLA Resin (8K)">High-Detail SLA Photopolymer Resin (8K)</option>
                <option value="Silk Co-Extrusion PLA">Silk Dual-Color Co-Extrusion PLA</option>
                <option value="Pine Wood Fiber Composite">Natural Wood-Fiber Composite</option>
                <option value="Flexible 95A TPU">Impact-Resistant Flexible TPU (95A)</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-medium block mb-1">Preferred Colorway</label>
              <input
                type="text"
                placeholder="e.g. Matte Obsidian Black, Silk Champagne Gold"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-medium block mb-1">Internal Infill Density</label>
              <select
                value={infill}
                onChange={(e) => setInfill(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-studio-card border border-white/10 text-white outline-none focus:border-amber-500"
              >
                <option value="15% Lightning (Visual Display Only)">15% Lightning (Ultra-Lightweight Display)</option>
                <option value="20% Gyroid (Balanced Strength & Weight)">20% Gyroid (Balanced Standard)</option>
                <option value="40% Honeycomb (Heavy Duty Mechanical)">40% Honeycomb (High Mechanical Stress)</option>
                <option value="100% Solid Solid Polycarbonate">100% Solid Infill (Indestructible Core)</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-medium block mb-1">Batch Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-zinc-300 font-medium block mb-1">
                Special Instructions, Functional Clearances, or Tolerances
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Needs to fit an M4 bolt thread, smooth exterior walls required, heat resistance needed up to 60°C..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Customer Contact Details */}
        <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4 text-xs">
          <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold">
            3. Customer Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-zinc-300 font-medium block mb-1">Your Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ananya Roy"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-medium block mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.g. ananya@designstudio.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-medium block mb-1">Phone / WhatsApp Number</label>
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Submission */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All uploads and intellectual property protected under Studio NDA.</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-subtle hover:shadow-glow transition-all"
          >
            <span>{submitting ? 'Submitting CAD...' : 'Submit Studio Commission'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
