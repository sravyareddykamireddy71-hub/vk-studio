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
    tagline: 'Premium 3D Printing & Customization Laboratory by Vamsi Krishna',
    whatsappNumber: '+91 98765 43210',
    instagramUrl: 'https://instagram.com/vk_studi_o',
    contactEmail: 'contact@vkstudio.design',
    contactPhone: '+91 98765 43210',
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

  const cleanWhatsapp = (settings.whatsappNumber || '+919876543210').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-studio-bg border-t border-white/10 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info with Official Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 shadow-subtle flex-shrink-0 bg-black">
                <img
                  src="/images/logo.jpg"
                  alt="VK STUDIO - Vamsi Krishna"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5 leading-none">
                  VK <span className="text-lime-400 font-bold tracking-widest text-lg">STUDIO</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mt-1">
                  By Vamsi Krishna
                </span>
              </div>
            </Link>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              VK STUDIO by Vamsi Krishna specializes in precision-slicing and manufacturing bespoke 3D-printed products, architectural signage, kinetic sculptures, and personalized lithophane artifacts.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/vk_studi_o"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600/15 hover:bg-pink-600/25 text-pink-300 border border-pink-500/30 transition-all font-medium"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>@vk_studi_o</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello VK STUDIO! I would like to inquire about a 3D printing commission.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 transition-all font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Studio</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-lime-400 transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/custom-quote" className="hover:text-lime-400 transition-colors text-lime-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-lime-400" />
                  Custom Commission
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-lime-400 transition-colors">
                  About Our Studio
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-lime-400 transition-colors">
                  Client Reviews
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-lime-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Disciplines
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=desk-workspace" className="hover:text-lime-400 transition-colors">
                  Desk & Workspace
                </Link>
              </li>
              <li>
                <Link href="/products?category=custom-nameplates-signage" className="hover:text-lime-400 transition-colors">
                  Custom Nameplates
                </Link>
              </li>
              <li>
                <Link href="/products?category=articulated-collectibles" className="hover:text-lime-400 transition-colors">
                  Articulated Figures
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-decor-lighting" className="hover:text-lime-400 transition-colors">
                  Home Decor & Lamps
                </Link>
              </li>
              <li>
                <Link href="/products?category=personalized-gifts" className="hover:text-lime-400 transition-colors">
                  Photo Lithophanes
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Studio Workshop
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-lime-400 flex-shrink-0 mt-0.5" />
                <span>{settings.studioAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
                <span>{settings.workingHours}</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                <a
                  href="https://instagram.com/vk_studi_o"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-pink-300 font-mono"
                >
                  @vk_studi_o
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-emerald-400 font-mono"
                >
                  {settings.whatsappNumber}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Studio Pillars Badges */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/5 text-lime-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white text-xs">50µ Layer Precision</p>
              <p className="text-[10px] text-zinc-500">Fine micro-step tolerances</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/5 text-lime-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white text-xs">Custom Bespoke CAD</p>
              <p className="text-[10px] text-zinc-500">Bespoke dimensions & names</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/5 text-lime-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white text-xs">Industrial Filaments</p>
              <p className="text-[10px] text-zinc-500">PLA, PETG, Resin & Carbon</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/5 text-lime-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white text-xs">Made-to-Order Studio</p>
              <p className="text-[10px] text-zinc-500">Freshly sliced & cured</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© 2026 VK STUDIO by Vamsi Krishna. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/vk_studi_o"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lime-400 transition-colors font-mono"
            >
              Instagram: @vk_studi_o
            </a>
            <span>•</span>
            <Link href="/admin" className="hover:text-lime-400 transition-colors font-mono">
              [Studio Admin Portal]
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
