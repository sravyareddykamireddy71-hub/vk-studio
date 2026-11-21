'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  FileText,
  Clock,
  Shield,
  LogOut,
  MapPin,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ORDER_STATUS_LABELS, REQUEST_STATUS_LABELS } from '@/lib/constants';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout, updateProfile, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'requests' | 'settings'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  // Edit profile state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditAddress(user.address || '');

      // Fetch user's orders and customization requests in parallel
      Promise.all([
        fetch('/api/orders').then((r) => (r.ok ? r.json() : { orders: [] })),
        fetch('/api/requests').then((r) => (r.ok ? r.json() : { requests: [] })),
      ])
        .then(([ordersData, requestsData]) => {
          setOrders(ordersData.orders || []);
          setRequests(requestsData.requests || []);
        })
        .catch(console.error)
        .finally(() => setFetchingData(false));
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const res = await updateProfile({
      name: editName,
      phone: editPhone,
      address: editAddress,
    });
    setSavingProfile(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (loading || !user) {
    return (
      <div className="py-24 text-center text-zinc-500 font-mono text-xs">
        Loading customer workspace...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Profile Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-studio-surface border border-white/10 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-black text-2xl flex items-center justify-center shadow-subtle">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-2xl text-white tracking-tight">
                {user.name}
              </h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-mono font-bold uppercase">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
            {user.phone && <p className="text-xs text-zinc-500 font-mono">{user.phone}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-subtle"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Workspace</span>
            </Link>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'orders'
              ? 'bg-amber-600 text-white shadow-subtle'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'requests'
              ? 'bg-amber-600 text-white shadow-subtle'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Custom Commissions & Quotes ({requests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-amber-600 text-white shadow-subtle'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile & Shipping Address</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {fetchingData ? (
            <p className="text-xs text-zinc-500 font-mono py-8">Fetching orders...</p>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-studio-surface border border-white/10 space-y-3">
              <Package className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Orders Placed Yet</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Explore our catalog to commission customized 3D-printed creations.
              </p>
              <Link
                href="/products"
                className="inline-block mt-2 px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => {
                const statusCfg = ORDER_STATUS_LABELS[ord.productionStatus] || {
                  label: ord.productionStatus,
                  color: 'bg-zinc-800 text-zinc-300',
                };
                return (
                  <div
                    key={ord.id}
                    className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4 shadow-subtle"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">
                            {ord.orderNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusCfg.color}`}>
                            {statusCfg.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Placed on {new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-zinc-500 font-mono block">Total Amount</span>
                        <span className="font-mono text-base font-bold text-amber-400">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {ord.items.map((it: any) => (
                        <div key={it.id} className="flex items-start justify-between text-xs">
                          <div>
                            <span className="font-semibold text-white">{it.productName}</span>
                            <span className="text-zinc-500 ml-2 font-mono">x{it.quantity}</span>
                            {it.customizationDetails && Object.keys(it.customizationDetails).length > 0 && (
                              <p className="text-[10px] text-zinc-400 mt-0.5">
                                {Object.entries(it.customizationDetails)
                                  .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
                                  .join(', ')}
                              </p>
                            )}
                          </div>
                          <span className="font-mono text-zinc-300">
                            ₹{it.totalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span>Shipping to {ord.city}, {ord.state}</span>
                      </div>

                      <Link
                        href={`/order-success/${ord.orderNumber}`}
                        className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>View Tracking & Receipt</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Customization Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-studio-surface border border-white/10 space-y-3">
              <Sparkles className="w-10 h-10 text-amber-400/50 mx-auto" />
              <h3 className="text-base font-bold text-white">No Custom Requests</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Have an STL file or custom CAD specification? Submit a request for slicing review.
              </p>
              <Link
                href="/custom-quote"
                className="inline-block mt-2 px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
              >
                Request Custom Commission
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => {
                const statusCfg = REQUEST_STATUS_LABELS[req.status] || {
                  label: req.status,
                  color: 'bg-zinc-800 text-zinc-300',
                };

                return (
                  <div
                    key={req.id}
                    className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4 shadow-subtle"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">
                            {req.referenceNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusCfg.color}`}>
                            {statusCfg.label}
                          </span>
                        </div>
                        <h4 className="font-semibold text-amber-300 text-sm mt-1">
                          {req.productTitle}
                        </h4>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-zinc-500 font-mono block">Studio Quote</span>
                        <span className="font-mono text-base font-bold text-white">
                          {req.finalQuote ? `₹${req.finalQuote.toLocaleString('en-IN')}` : req.estimatedPrice ? `₹${req.estimatedPrice.toLocaleString('en-IN')} (Est.)` : 'Reviewing CAD'}
                        </span>
                      </div>
                    </div>

                    {req.adminResponse && (
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1 text-xs">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                          Studio Artisan Response:
                        </span>
                        <p className="text-zinc-200">{req.adminResponse}</p>
                      </div>
                    )}

                    {req.referenceFileUrl && (
                      <div className="text-xs">
                        <a
                          href={req.referenceFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
                        >
                          <span>Attached CAD / Reference File</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-zinc-500 font-mono">
                        Submitted: {new Date(req.createdAt).toLocaleDateString()}
                      </span>

                      <a
                        href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello VK STUDIO! I am checking on my commission request #${req.referenceNumber}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Discuss with Artisan</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile Settings */}
      {activeTab === 'settings' && (
        <form
          onSubmit={handleSaveProfile}
          className="p-8 rounded-2xl bg-studio-surface border border-white/10 max-w-xl space-y-5 text-xs"
        >
          <h3 className="text-sm font-bold text-white">Edit Personal & Shipping Details</h3>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div>
            <label className="text-zinc-300 font-medium block mb-1">Full Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">Email (Cannot be modified)</label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-zinc-500 outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">Contact / WhatsApp Phone</label>
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">Default Shipping Address</label>
            <textarea
              rows={3}
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs transition-all"
          >
            {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      )}
    </div>
  );
}
