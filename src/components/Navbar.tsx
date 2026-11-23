'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  MessageCircle,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount, openCart, whatsappNumber, getWhatsAppCustomInquiryUrl } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

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
        className={`sticky top-0 z-40 w-full transition-all duration-500 ease-out ${isScrolled
          ? 'bg-white/95 dark:bg-[#0C0D0E]/95 backdrop-blur-2xl border-b border-zinc-200/90 dark:border-white/10 shadow-md dark:shadow-premium py-2.5'
          : 'bg-white/90 dark:bg-[#0C0D0E]/85 backdrop-blur-xl border-b border-zinc-200/60 dark:border-white/10 py-3.5 shadow-none'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* VK STUDIO Official Logo & Wordmark */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-300 dark:border-white/20 shadow-md group-hover:border-lime-500 transition-all duration-300 flex-shrink-0 bg-zinc-950 ring-2 ring-black/5 dark:ring-white/5 p-0.5">
                <img
                  src="/images/logo.jpg"
                  alt="VK STUDIO - Vamsi Krishna Official Logo"
                  className="w-full h-full object-cover rounded-lg sm:rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-zinc-950 dark:text-white flex items-center gap-1 sm:gap-1.5 leading-none">
                  VK <span className="text-emerald-700 dark:text-lime-400 font-bold tracking-widest text-base sm:text-lg">STUDIO</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-zinc-600 dark:text-zinc-400 uppercase mt-0.5 sm:mt-1 font-semibold">
                  By Vamsi Krishna
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
              <Link
                href="/"
                className={`relative py-1 transition-colors duration-200 ${isActive('/')
                  ? 'text-emerald-700 dark:text-lime-400 after:w-full'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-lime-400 after:w-0 hover:after:w-full'
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-emerald-600 dark:after:bg-lime-400 after:transition-all after:duration-300`}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`relative py-1 flex items-center gap-1.5 transition-colors duration-200 ${isActive('/products')
                  ? 'text-emerald-700 dark:text-lime-400 after:w-full'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-lime-400 after:w-0 hover:after:w-full'
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-emerald-600 dark:after:bg-lime-400 after:transition-all after:duration-300`}
              >
                Explore Products
              </Link>
              <Link
                href="/custom-quote"
                className={`relative py-1 flex items-center gap-1.5 font-bold transition-colors duration-200 ${isActive('/custom-quote')
                  ? 'text-emerald-700 dark:text-lime-400 after:w-full'
                  : 'text-emerald-700 dark:text-lime-300 hover:text-emerald-800 dark:hover:text-lime-400 after:w-0 hover:after:w-full'
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-emerald-600 dark:after:bg-lime-400 after:transition-all after:duration-300`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" />
                Custom 3D via WhatsApp
              </Link>
              <Link
                href="/#about"
                className="relative py-1 text-zinc-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-lime-400 transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-emerald-600 dark:after:bg-lime-400 after:transition-all after:duration-300"
              >
                About Studio
              </Link>
              <a
                href="https://instagram.com/vk_studi_o"
                target="_blank"
                rel="noopener noreferrer"
                className="relative py-1 text-pink-700 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 transition-colors duration-200 text-xs font-mono font-medium after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-pink-500 after:transition-all after:duration-300"
              >
                @vk_studi_o
              </a>
            </nav>

            {/* Right Action Icons: Search, WhatsApp, Cart, Theme, Account */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* WhatsApp Direct Contact Button */}
              <a
                href={getWhatsAppCustomInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                title={`Chat with VK STUDIO on WhatsApp (${whatsappNumber})`}
                aria-label="Chat on WhatsApp"
                className="p-2 sm:p-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-all shadow-sm flex items-center gap-1.5 btn-hover-effect"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden xl:inline text-xs font-bold text-emerald-800 dark:text-emerald-300">WhatsApp</span>
              </a>

              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
                className="p-2 sm:p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-zinc-300 dark:hover:text-white transition-all shadow-sm btn-hover-effect"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Theme Toggle (Dark / Light) */}
              <ThemeToggle className="btn-hover-effect" />

              {/* Shopping Cart Button */}
              <button
                onClick={openCart}
                aria-label="Shopping Cart"
                className="relative p-2 sm:p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 hover:text-emerald-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-zinc-300 dark:hover:text-lime-400 transition-all shadow-sm group btn-hover-effect"
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
                    className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 dark:bg-white/5 dark:border-white/10 dark:hover:border-white/25 transition-all text-xs text-zinc-900 dark:text-white shadow-sm"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 dark:bg-lime-500/20 text-emerald-800 dark:text-lime-400 font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                      {user.name}
                    </span>
                    {isAdmin && (
                      <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-lime-400 text-black uppercase">
                        Admin
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl glass-dropdown p-2 shadow-premium border border-zinc-200 dark:border-white/10 z-50 text-xs"
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-zinc-200 dark:border-white/10 mb-1">
                        <p className="font-semibold text-zinc-950 dark:text-white truncate">{user.name}</p>
                        <p className="text-zinc-500 dark:text-zinc-400 text-[11px] truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-700 dark:text-lime-400 hover:bg-emerald-500/10 dark:hover:bg-lime-500/10 transition-colors font-medium"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Workspace
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        My Orders & Requests
                      </Link>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-left"
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
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs tracking-wide shadow-subtle hover:shadow-glow transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-[#0C0D0E]/95 backdrop-blur-2xl border-t border-zinc-200 dark:border-white/10 px-4 sm:px-6 py-5 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-800 dark:text-zinc-200 hover:text-emerald-700 dark:hover:text-lime-400 text-sm font-semibold py-2.5 px-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-800 dark:text-zinc-200 hover:text-emerald-700 dark:hover:text-lime-400 text-sm font-semibold py-2.5 px-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
            >
              Explore Products
            </Link>
            <Link
              href="/custom-quote"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-emerald-700 dark:text-lime-300 hover:text-emerald-800 dark:hover:text-lime-200 text-sm font-bold py-2.5 px-3 rounded-xl hover:bg-emerald-500/10 dark:hover:bg-lime-500/10 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-lime-400" />
              Custom 3D via WhatsApp
            </Link>
            <a
              href={getWhatsAppCustomInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 text-sm font-bold py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Chat on WhatsApp ({whatsappNumber})
            </a>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-800 dark:text-zinc-200 hover:text-emerald-700 dark:hover:text-lime-400 text-sm font-semibold py-2.5 px-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
            >
              About Studio
            </Link>
            <a
              href="https://instagram.com/vk_studi_o"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-pink-700 dark:text-pink-400 hover:text-pink-600 text-xs font-mono font-medium py-2.5 px-3 rounded-xl hover:bg-pink-500/10 transition-colors"
            >
              Instagram: @vk_studi_o
            </a>

            <div className="pt-3 border-t border-zinc-200 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between py-1 px-3">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Theme</span>
                <ThemeToggle showLabel />
              </div>
              {user ? (
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-zinc-800 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white text-xs font-medium py-2 px-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5"
                  >
                    My Account & Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-emerald-700 dark:text-lime-400 font-bold text-xs py-2 px-3 rounded-xl hover:bg-emerald-500/10 dark:hover:bg-lime-500/10"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="block w-full text-left text-red-500 text-xs font-medium py-2 px-3 rounded-xl hover:bg-red-500/10"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center w-full py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-sm"
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
