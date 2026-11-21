'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register({
      name,
      email,
      password,
      phone,
    });
    setLoading(false);

    if (result.success) {
      router.push('/profile');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
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
            Create VK STUDIO Account
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Track your custom 3D printing orders, save designs, and synchronize your cart.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-studio-surface border border-zinc-200 dark:border-white/10 shadow-xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-zinc-950 dark:text-white placeholder-zinc-400 outline-none focus:border-lime-500 transition-colors text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-zinc-950 dark:text-white placeholder-zinc-400 outline-none focus:border-lime-500 transition-colors text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1.5">Phone / WhatsApp Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-zinc-950 dark:text-white placeholder-zinc-400 outline-none focus:border-lime-500 transition-colors text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1.5">Password (Min 6 characters) *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Create a password"
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
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-zinc-200 dark:border-white/5 text-xs text-zinc-600 dark:text-zinc-400">
            <span>Already have an account? </span>
            <Link href="/login" className="text-emerald-700 dark:text-lime-400 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
