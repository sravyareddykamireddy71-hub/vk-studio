'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Instagram,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Cpu,
  Sparkles,
  ArrowUpRight,
  Layers,
} from 'lucide-react';

export default function Footer() {
  const [settings, setSettings] = useState<any>({
    brandName: 'VK STUDIO',
    tagline: 'Custom 3D Printing & Personalized Gifts by Vamsi Krishna',
    whatsappNumber: '+91 91004 84870',
    instagramUrl: 'https://instagram.com/vk_studi_o',
    contactEmail: 'contact@vkstudio.design',
    contactPhone: '+91 91004 84870',
    studioAddress: 'VK Studio, Bengaluru, Karnataka, India',
    workingHours: 'Monday – Saturday: 10:00 AM – 8:00 PM IST',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const cleanWhatsapp = (settings.whatsappNumber || '+919100484870').replace(/[^0-9]/g, '');

  return (
    <footer className="relative z-20 bg-white dark:bg-[#0C0D0E] border-t border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-400 text-xs shadow-2xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info with Official Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Prestigious emblem container that looks stunning in both light and dark */}
              <div className="w-12 h-12 rounded-2xl p-1 bg-zinc-950 border border-zinc-300 dark:border-white/20 shadow-md group-hover:border-lime-500 transition-all flex-shrink-0 ring-2 ring-black/5 dark:ring-white/5">
                <img
                  src="/images/logo.jpg"
                  alt="VK STUDIO - Vamsi Krishna"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl tracking-tight text-zinc-950 dark:text-white flex items-center gap-1.5 leading-none">
                  VK <span className="text-emerald-700 dark:text-lime-400 font-bold tracking-widest text-lg">STUDIO</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-zinc-600 dark:text-zinc-400 uppercase mt-1 font-semibold">
                  By Vamsi Krishna
                </span>
              </div>
            </Link>

            <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed max-w-sm">
              VK STUDIO by Vamsi Krishna specializes in custom 3D printed products, personalized nameplates, phone stands, lithophane photo lamps, and unique gifts. 100% 3D printed with care.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/vk_studi_o"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600/10 hover:bg-pink-600/20 text-pink-700 dark:text-pink-300 border border-pink-500/30 transition-all font-semibold"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span>@vk_studi_o</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Vamsi Krishna! I would like to inquire about a custom 3D print.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30 transition-all font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>WhatsApp Studio</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-950 dark:text-white font-bold">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-lime-400 transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/custom-quote" className="text-emerald-700 dark:text-lime-300 hover:underline font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-lime-400" />
                  Custom 3D Commission
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-lime-400 transition-colors">
                  About Our Studio
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-lime-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-950 dark:text-white font-bold">
              3D Print Types
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=desk-workspace" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-lime-400 transition-colors">
                  Desk & Workspace
                </Link>
              </li>
              <li>
                <Link href="/products?category=custom-nameplates-signage" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-lime-400 transition-colors">
                  Custom Nameplates
                </Link>
              </li>
              <li>
                <Link href="/products?category=articulated-collectibles" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-lime-400 transition-colors">
                  Articulated Figures
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-decor-lighting" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-lime-400 transition-colors">
                  Home Decor & Lamps
                </Link>
              </li>
              <li>
                <Link href="/products?category=personalized-gifts" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-lime-400 transition-colors">
                  Photo Lithophanes
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-950 dark:text-white font-bold">
              Studio Workshop
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 dark:text-lime-400 flex-shrink-0 mt-0.5" />
                <span className="text-zinc-700 dark:text-zinc-300">{settings.studioAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-700 dark:text-lime-400 flex-shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300">{settings.workingHours}</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                <a
                  href="https://instagram.com/vk_studi_o"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-pink-700 dark:text-pink-300 font-mono font-medium"
                >
                  @vk_studi_o
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-emerald-700 dark:text-emerald-400 font-mono font-medium"
                >
                  {settings.whatsappNumber}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Studio Pillars Badges */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/5">
            <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-lime-400/10 text-emerald-700 dark:text-lime-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-zinc-950 dark:text-white text-xs">Smooth 3D Print Finish</p>
              <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Crisp, clean micro-layers</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/5">
            <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-lime-400/10 text-emerald-700 dark:text-lime-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-zinc-950 dark:text-white text-xs">Personalized For You</p>
              <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Your name, colors & size</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/5">
            <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-lime-400/10 text-emerald-700 dark:text-lime-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-zinc-950 dark:text-white text-xs">100% 3D Printed</p>
              <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Premium PLA & Tough PETG</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/5">
            <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-lime-400/10 text-emerald-700 dark:text-lime-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-zinc-950 dark:text-white text-xs">Made Just For You</p>
              <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Printed fresh upon order</p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* BOTTOM BAR: HIGHLY VISIBLE COPYRIGHT SECTION IN BOTH THEMES     */}
        {/* ============================================================== */}
        <div className="mt-10 p-5 rounded-2xl bg-zinc-100 dark:bg-black/60 border border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <p className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-[13px] tracking-wide">
            © 2026 VK STUDIO by Vamsi Krishna. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <a
              href="https://instagram.com/vk_studi_o"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-700 dark:text-pink-300 hover:underline font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
              <span>Instagram: @vk_studi_o</span>
            </a>
            <span className="text-zinc-400 dark:text-zinc-600 font-bold">•</span>
            <Link
              href="/admin"
              className="text-emerald-800 dark:text-lime-400 hover:underline font-mono font-bold transition-colors"
            >
              [Studio Admin Portal]
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
