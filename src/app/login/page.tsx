'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user?.role === 'ADMIN' || email.toLowerCase().trim() === 'vamsireddy.kata@gmail.com') {
        router.push('/admin');
      } else {
        router.push('/profile');
      }
    } else {
      setError(result.error || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 rounded-2xl p-1 bg-zinc-950 border border-zinc-300 dark:border-white/20 shadow-md group-hover:border-lime-500 transition-all mx-auto ring-2 ring-black/5 dark:ring-white/5">
              <img
                src="/images/logo.jpg"
                alt="VK STUDIO - Vamsi Krishna"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <span className="text-[11px] font-mono tracking-widest text-emerald-700 dark:text-lime-400 uppercase font-bold">
              VK STUDIO • VAMSI KRISHNA
            </span>
          </Link>
          <h1 className="font-display font-black text-2xl text-zinc-950 dark:text-white tracking-tight">
            Sign In to VK STUDIO
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Access your custom 3D printing orders, saved designs, and tracking.
          </p>
        </div>

        {/* Clean Form Container */}
        <div className="p-8 rounded-3xl bg-white dark:bg-studio-surface border border-zinc-200 dark:border-white/10 shadow-xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-zinc-950 dark:text-white placeholder-zinc-400 outline-none focus:border-lime-500 transition-colors text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-zinc-700 dark:text-zinc-300 font-semibold">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-zinc-950 dark:text-white placeholder-zinc-400 outline-none focus:border-lime-500 transition-colors text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-glow transition-all"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-zinc-200 dark:border-white/5 text-xs text-zinc-600 dark:text-zinc-400">
            <span>Don&apos;t have an account yet? </span>
            <Link href="/register" className="text-emerald-700 dark:text-lime-400 font-bold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
