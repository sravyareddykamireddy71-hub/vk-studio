'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Clock,
  Sparkles,
  Camera,
  Layers,
  Truck,
  CheckCircle2,
  Send,
  Instagram,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CustomQuotePage() {
  const { user } = useAuth();
  const [ideaText, setIdeaText] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('+91 91004 84870');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.whatsappNumber) {
          setWhatsappNumber(data.settings.whatsappNumber);
        }
      })
      .catch(() => {});
  }, []);

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const getWhatsAppCommissionUrl = () => {
    let message = `Hello VK STUDIO!\n\nI would like to discuss a custom 3D printing project.`;
    if (user?.name) {
      message += `\nMy Name: ${user.name}`;
    }
    if (ideaText.trim()) {
      message += `\n\nProject Idea / Description:\n"${ideaText.trim()}"`;
    }
    message += `\n\nPlease let me know the pricing, timeline, and how we can proceed with design references.\n\nThank you!`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* 1. Header Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-lime-400/10 border border-emerald-500/20 dark:border-lime-400/20 text-xs font-mono font-bold text-emerald-700 dark:text-lime-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VK STUDIO • BESPOKE 3D CREATIONS</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-zinc-950 dark:text-white tracking-tight leading-tight">
          Looking for something customized?
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-lime-600 to-emerald-600 dark:from-lime-400 dark:via-emerald-300 dark:to-lime-500 mt-1">
            We can create it for you.
          </span>
        </h1>

        <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Contact us on WhatsApp to discuss your idea. Share reference photos, names, or dimensions,
          and Vamsi Krishna will guide you directly with custom pricing and material options.
        </p>
      </div>

      {/* 2. Mandatory 4-Day Preparation Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 dark:bg-amber-400/10 dark:border-amber-400/20 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Production Time Information:</p>
          <p className="leading-relaxed">
            Every creation takes time and care. Our products require a minimum of 4 days for preparation.
            Need it urgently? Contact us on WhatsApp to discuss availability.
          </p>
        </div>
      </div>

      {/* 3. Interactive Custom Inquiry Card */}
      <div className="p-6 sm:p-8 hyper-card shadow-xl space-y-6">
        <div className="space-y-1">
          <h2 className="font-display font-black text-xl text-zinc-950 dark:text-white">
            What would you like us to 3D print?
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Describe your idea below or go straight to WhatsApp to share reference pictures, sketches, or 3D files.
          </p>
        </div>

        <div className="space-y-3">
          <textarea
            rows={4}
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            placeholder="e.g. I need a personalized dual-color lithophane photo lamp for an anniversary gift, or a custom desk nameplate in matte black and silk gold..."
            className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-600 dark:focus:border-lime-400 text-sm transition-all"
          />

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium self-center">Popular ideas:</span>
            {[
              'Personalized Lithophane Lamp',
              'Desk Nameplate with Logo',
              'Articulated Kinetic Dragon',
              'Architectural Scale Model',
              'Custom Keychains (Bulk)',
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setIdeaText(tag)}
                className="px-3 py-1 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <a
            href={getWhatsAppCommissionUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg hover:shadow-emerald-500/25 transition-all hover:-translate-y-0.5"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Proceed on WhatsApp</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center mt-2.5">
            Opens official VK STUDIO WhatsApp ({whatsappNumber}) with your project details prefilled.
          </p>
        </div>
      </div>

      {/* 4. Simple 3-Step WhatsApp Process */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-zinc-950 dark:text-white text-center">
          How Customization Works at VK STUDIO
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 hyper-card shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-lime-400/10 text-emerald-700 dark:text-lime-400 flex items-center justify-center font-bold text-sm">
              <Camera className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-zinc-950 dark:text-white text-sm">1. Share Your Idea</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Send reference pictures, sketches, names, or 3D files directly in our WhatsApp chat.
            </p>
          </div>

          <div className="p-5 hyper-card shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-lime-400/10 text-emerald-700 dark:text-lime-400 flex items-center justify-center font-bold text-sm">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-zinc-950 dark:text-white text-sm">2. Finalize Design & Quote</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Vamsi Krishna will review dimensions, filament colors, price quote, and timeline with you.
            </p>
          </div>

          <div className="p-5 hyper-card shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-lime-400/10 text-emerald-700 dark:text-lime-400 flex items-center justify-center font-bold text-sm">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-zinc-950 dark:text-white text-sm">3. 3D Printed & Delivered</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Precision 3D printed with quality checks and safely packaged for doorstep delivery across India.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Direct Studio Contact Info */}
      <div className="p-6 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-bold text-zinc-950 dark:text-white text-sm">Prefer Direct Contact?</p>
          <p className="text-zinc-600 dark:text-zinc-400">
            WhatsApp: <strong className="text-emerald-700 dark:text-lime-400">{whatsappNumber}</strong> • Instagram:{' '}
            <strong className="text-pink-600">@vk_studi_o</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 font-semibold hover:bg-zinc-50 transition-colors"
          >
            Browse Products
          </Link>
          <a
            href={getWhatsAppCommissionUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1.5 hover:bg-emerald-500 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
