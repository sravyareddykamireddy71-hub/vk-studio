'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Box,
  Sparkles,
  ShoppingBag,
  Users,
  Star,
  Settings,
  MessageSquare,
  LogOut,
  ArrowUpRight,
  ShieldAlert,
  Layers,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Box },
    { label: 'Custom Requests', href: '/admin/requests', icon: Sparkles },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
    { label: 'Website CMS', href: '/admin/content', icon: Settings },
    { label: 'Inquiries', href: '/admin/messages', icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-studio-bg flex items-center justify-center font-mono text-xs text-zinc-500">
        Verifying administrative authorization...
      </div>
    );
  }

  // Unauthorized screen if not admin
  const isAuthorizedAdmin = user && (user.role === 'ADMIN' || user.email?.toLowerCase().trim() === 'vamsireddy.kata@gmail.com');
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-studio-surface border border-red-500/20 text-center space-y-4 shadow-premium">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            This workspace is reserved exclusively for the VK STUDIO Director (vamsireddy.kata@gmail.com). Please authenticate with administrator credentials to manage the studio.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-semibold text-xs transition-all"
            >
              Sign In as Admin (vamsireddy.kata@gmail.com)
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-studio-bg flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-studio-surface border-r border-zinc-200 dark:border-white/10 p-5 flex flex-col justify-between flex-shrink-0 transition-colors">
        <div className="space-y-6">
          {/* Logo & Portal Badge */}
          <div className="space-y-1">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-zinc-300 dark:border-white/20 shadow-sm flex-shrink-0 bg-zinc-950 ring-1 ring-black/5 p-0.5">
                <img
                  src="/images/logo.jpg"
                  alt="VK STUDIO - Vamsi Krishna"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-sm text-zinc-950 dark:text-white tracking-tight flex items-center gap-1">
                  VK <span className="text-emerald-700 dark:text-lime-400 font-bold text-xs">STUDIO</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-zinc-600 dark:text-zinc-400 uppercase font-semibold">
                  Vamsi Krishna Atelier
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${isActive
                      ? 'bg-lime-500 text-black font-extrabold shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5'
                    }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-zinc-200 dark:border-white/10 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-300 text-xs transition-colors font-medium"
          >
            <span>Live Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
          </Link>

          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
            <span className="truncate max-w-[120px] font-medium">{user.name}</span>
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 font-semibold"
            >
              <LogOut className="w-3 h-3" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <div className="flex-1 min-w-0 flex flex-col bg-zinc-50/60 dark:bg-transparent">
        {/* Top bar */}
        <header className="h-16 border-b border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-[#141618]/90 backdrop-blur-md px-6 flex items-center justify-between text-xs transition-colors">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-mono">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-950 dark:text-white font-bold capitalize">
              {pathname.replace('/admin', '').replace('/', '') || 'Overview'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>3D Printers: Ready</span>
            </div>

            <ThemeToggle />

            <div className="text-right">
              <span className="font-bold text-zinc-950 dark:text-white block text-xs">{user.name}</span>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block font-mono font-medium">Studio Director</span>
            </div>
          </div>
        </header>

        {/* Body Content */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
