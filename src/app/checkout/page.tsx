'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  DollarSign,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [postalCode, setPostalCode] = useState('560038');
  const [state, setState] = useState('Karnataka');
  const [paymentMethod, setPaymentMethod] = useState('DIRECT_UPI');
  const [customerNotes, setCustomerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Autofill if logged in
  useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.email) setCustomerEmail(user.email);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.address) setShippingAddress(user.address);
    }
  }, [user]);

  const shippingFee = subtotal >= 1999 || subtotal === 0 ? 0 : 150;
  const grandTotal = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-xs text-zinc-400">Please add products to your cart before proceeding to checkout.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white font-semibold text-xs"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setError('Please fill in all required delivery and contact details.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          city,
          postalCode,
          state,
          items,
          subtotal,
          shippingFee,
          totalAmount: grandTotal,
          paymentMethod,
          customerNotes,
          clearCartAfter: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        // Clear local cart
        await clearCart();
        router.push(`/order-success/${data.order.orderNumber}`);
      } else {
        setError(data.error || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Cart</span>
        </Link>
        <h1 className="font-display font-black text-3xl text-white tracking-tight">
          Studio Checkout & Commission Confirmation
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Provide your delivery details to initiate precision slicing and bespoke fabrication.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-8">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* 1. Customer Information */}
            <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold">
                1. Customer & Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Kashyap"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Email Address (for invoice & tracking) *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. vikram@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-zinc-300 font-medium block mb-1">Phone / WhatsApp Number (for slicing updates) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold">
                2. Delivery Destination
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Street Address, Suite / Flat Number *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Flat 301, Tower B, Prestige Palms, 12th Main Road"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-zinc-300 font-medium block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-medium block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-medium block mb-1">Postal PIN Code *</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Delivery Notes / Landmark (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Indiranagar Metro, call upon arrival"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold">
                3. Payment Method
              </h3>

              <div className="space-y-3">
                {[
                  {
                    id: 'DIRECT_UPI',
                    title: 'Direct UPI / QR Transfer (Instant Confirmation)',
                    desc: 'Pay directly via GPay, PhonePe, Paytm, or BHIM. You will receive studio UPI details upon submission.',
                    icon: QrCode,
                  },
                  {
                    id: 'STUDIO_CONFIRMATION',
                    title: 'Studio Pay on Design Review',
                    desc: 'Review CAD slicing preview and finish samples with our studio director prior to payment.',
                    icon: CreditCard,
                  },
                  {
                    id: 'CASH_ON_DELIVERY',
                    title: 'Cash on Delivery / Studio Pickup',
                    desc: 'Pay upon delivery or when picking up your finished piece from our Bengaluru lab.',
                    icon: DollarSign,
                  },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`w-full p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                      paymentMethod === pm.id
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-subtle'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <pm.icon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{pm.title}</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{pm.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirmation */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-6 shadow-subtle">
              <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                Commission Summary ({items.length} {items.length === 1 ? 'Design' : 'Designs'})
              </h3>

              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto space-y-3 pr-1">
                {items.map((it) => (
                  <div key={it.id} className="pt-3 first:pt-0 flex items-start gap-3 text-xs">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{it.product.name}</p>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        Qty: {it.quantity} • Unit: ₹{(it.unitPrice + it.customizationPrice).toLocaleString('en-IN')}
                      </p>
                      {it.customizationData && Object.keys(it.customizationData).length > 0 && (
                        <p className="text-[10px] text-amber-400 truncate mt-0.5">
                          {Object.entries(it.customizationData)
                            .map(([k, v]) => `${k}: ${v}`)
                            .slice(0, 2)
                            .join(' • ')}
                        </p>
                      )}
                    </div>
                    <span className="font-mono font-bold text-white">
                      ₹{it.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-white">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-300">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    White-Glove Shipping
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-base font-bold text-white">
                  <span>Grand Total</span>
                  <span className="font-mono text-xl text-amber-400">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-subtle hover:shadow-glow transition-all"
              >
                <span>{submitting ? 'Placing Order...' : 'Confirm Studio Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>SSL Encrypted • Studio Slicing Verification Before Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
