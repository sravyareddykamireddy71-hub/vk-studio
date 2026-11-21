'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Sparkles,
  LogOut,
  Shield,
  Package,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const router = useRouter();

  // Scroll detection for glassy stickiness
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.products || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-studio-bg/95 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 shadow-sm dark:shadow-premium py-2.5'
            : 'bg-white/80 dark:bg-transparent border-b border-zinc-200/60 dark:border-transparent py-4 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* VK STUDIO Official Logo & Wordmark */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-zinc-300 dark:border-white/20 shadow-md group-hover:border-lime-500 transition-all duration-300 flex-shrink-0 bg-zinc-950 ring-2 ring-black/5 dark:ring-white/5 p-0.5">
                <img
                  src="/images/logo.jpg"
                  alt="VK STUDIO - Vamsi Krishna Official Logo"
                  className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
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

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <Link
                href="/"
                className="hover:text-emerald-700 dark:hover:text-lime-400 transition-colors py-1 relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-emerald-600 dark:hover:after:bg-lime-400"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="hover:text-emerald-700 dark:hover:text-lime-400 transition-colors py-1 flex items-center gap-1.5"
              >
                Explore Products
              </Link>
              <Link
                href="/custom-quote"
                className="text-emerald-700 dark:text-lime-300 hover:text-emerald-800 dark:hover:text-lime-400 transition-colors py-1 flex items-center gap-1 font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" />
                Custom Commission
              </Link>
              <Link
                href="/#about"
                className="hover:text-emerald-700 dark:hover:text-lime-400 transition-colors py-1"
              >
                About Studio
              </Link>
              <Link
                href="/#reviews"
                className="hover:text-emerald-700 dark:hover:text-lime-400 transition-colors py-1"
              >
                Reviews
              </Link>
              <a
                href="https://instagram.com/vk_studi_o"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-600 text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 transition-colors py-1 text-xs font-mono font-medium"
              >
                @vk_studi_o
              </a>
            </nav>

            {/* Right Action Icons: Search, Cart, Account */}
            <div className="flex items-center gap-3">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
                className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-zinc-300 dark:hover:text-white transition-all shadow-sm"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Theme Toggle (Dark / Light) */}
              <ThemeToggle />

              {/* Shopping Cart Button */}
              <button
                onClick={openCart}
                aria-label="Shopping Cart"
                className="relative p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 hover:text-emerald-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-zinc-300 dark:hover:text-lime-400 transition-all shadow-sm group"
              >
                <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-lime-400 text-black text-[11px] font-bold shadow-sm">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Account / Profile Button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 transition-all text-xs text-white"
                  >
                    <div className="w-6 h-6 rounded-lg bg-lime-500/20 text-lime-400 font-bold flex items-center justify-center text-[11px]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                      {user.name}
                    </span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-lime-400 text-black uppercase">
                        Admin
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl glass-dropdown p-2 shadow-premium border border-white/10 z-50 text-xs"
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <p className="text-zinc-400 text-[11px] truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-lime-400 hover:bg-lime-500/10 transition-colors font-medium"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Workspace
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        My Orders & Requests
                      </Link>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs tracking-wide shadow-subtle hover:shadow-glow transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-dropdown border-t border-white/10 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-200 hover:text-lime-400 text-base font-medium py-1"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-200 hover:text-lime-400 text-base font-medium py-1"
            >
              Explore Products
            </Link>
            <Link
              href="/custom-quote"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lime-300 hover:text-lime-200 text-base font-semibold py-1 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-lime-400" />
              Custom 3D Commission
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-200 hover:text-lime-400 text-base font-medium py-1"
            >
              About Studio
            </Link>
            <Link
              href="/#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-200 hover:text-lime-400 text-base font-medium py-1"
            >
              Client Reviews
            </Link>
            <a
              href="https://instagram.com/vk_studi_o"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-zinc-400 hover:text-lime-400 text-sm font-mono py-1"
            >
              Instagram: @vk_studi_o
            </a>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-medium text-zinc-300">Theme</span>
                <ThemeToggle showLabel />
              </div>
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-zinc-300 hover:text-white text-sm"
                  >
                    My Account & Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-lime-400 font-semibold text-sm"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="block text-red-400 text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center w-full py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-sm"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Live Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-2xl bg-studio-card border border-white/15 rounded-2xl shadow-premium overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search className="w-5 h-5 text-lime-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search products by name, category, or filament..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-zinc-500 text-base outline-none"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 space-y-3">
              {searching ? (
                <div className="py-8 text-center text-zinc-400 text-sm">
                  Searching studio archives...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 px-2">
                    Matching Creations ({searchResults.length})
                  </p>
                  {searchResults.map((product) => {
                    const images = JSON.parse(product.images || '[]');
                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <img
                          src={images[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80'}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white group-hover:text-lime-400 transition-colors truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-zinc-400 truncate">{product.tagline || product.category?.name}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm font-bold text-lime-400">
                            ₹{product.basePrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : searchQuery.trim() ? (
                <div className="py-8 text-center text-zinc-400 text-sm">
                  No 3D products found matching &quot;{searchQuery}&quot;.
                </div>
              ) : (
                <div className="py-6 text-center text-zinc-500 text-xs">
                  Type to search through customized keychains, architectural lamps, desk docks, figures, and nameplates.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
