'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('customer@vkstudio.com');
  const [password, setPassword] = useState('customer123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (email.toLowerCase().includes('admin')) {
        router.push('/admin');
      } else {
        router.push('/profile');
      }
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  // One-click demo login helpers
  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shadow-premium bg-black mx-auto">
              <img
                src="/images/logo.jpg"
                alt="VK STUDIO - Vamsi Krishna"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[11px] font-mono tracking-widest text-lime-400 uppercase font-semibold">
              VK STUDIO • VAMSI KRISHNA
            </span>
          </Link>
          <h1 className="font-display font-black text-2xl text-white tracking-tight">
            Sign In to VK STUDIO
          </h1>
          <p className="text-xs text-zinc-400">
            Access your custom commissions, saved designs, and order history.
          </p>
        </div>

        {/* Demo Quick Logins */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
          <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
            ⚡ Quick Demo Accounts (Click to Autofill):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer@vkstudio.com', 'customer123')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all"
            >
              <div className="font-bold text-white text-[11px] flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-amber-400" />
                Customer
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">customer@vkstudio.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@vkstudio.com', 'admin123')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all"
            >
              <div className="font-bold text-amber-400 text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Studio Admin
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">admin@vkstudio.com</div>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-8 rounded-3xl bg-studio-surface border border-white/10 shadow-premium space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-300 font-medium block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-300 font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Password reset simulation: Please use customer123 or admin123')}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-subtle hover:shadow-glow transition-all pt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Studio'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-white/5 text-xs text-zinc-400">
            <span>Don&apos;t have an account yet? </span>
            <Link href="/register" className="text-amber-400 font-semibold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
