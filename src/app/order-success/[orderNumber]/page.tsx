import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  MessageCircle,
  Printer,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { ORDER_STATUS_LABELS } from '@/lib/constants';

export const revalidate = 0;

interface OrderSuccessPageProps {
  params: {
    orderNumber: string;
  };
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderNumber } = params;

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ orderNumber }, { id: orderNumber }],
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const statusConfig = ORDER_STATUS_LABELS[order.productionStatus] || {
    label: order.productionStatus,
    color: 'bg-zinc-800 text-zinc-300',
    step: 1,
  };

  const steps = [
    { key: 'ORDER_RECEIVED', label: 'Received' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'IN_PRODUCTION', label: '3D Printing' },
    { key: 'QUALITY_CHECK', label: 'QA Check' },
    { key: 'READY_FOR_DISPATCH', label: 'Packaged' },
    { key: 'SHIPPED', label: 'Dispatched' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.productionStatus);

  const whatsappMessage = encodeURIComponent(
    `*Hello VK STUDIO!* 👋\n\nI just placed Order *#${order.orderNumber}* for ₹${order.totalAmount.toLocaleString(
      'en-IN'
    )}.\n\n*Customer:* ${order.customerName}\n*Phone:* ${order.customerPhone}\n*Items:* ${order.items
      .map((it) => it.productName)
      .join(', ')}\n\nPlease share the slicing confirmation and production updates. Thank you!`
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Confirmation Banner */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-subtle">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
            Commission Order Placed
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Thank You, {order.customerName.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Your custom 3D printing commission has been queued into our studio slicing system under Reference{' '}
            <strong className="text-white font-mono">{order.orderNumber}</strong>.
          </p>
        </div>
      </div>

      {/* Production Progress Step Bar */}
      <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Live Status</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
              {order.trackingNumber && (
                <span className="text-xs font-mono text-zinc-400">
                  Tracking: {order.courier} ({order.trackingNumber})
                </span>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right text-xs font-mono text-zinc-400">
            <span>Placed On: {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Step Icons */}
        <div className="hidden sm:grid grid-cols-7 gap-2 text-center text-[10px] font-mono">
          {steps.map((st, i) => {
            const isCompleted = currentStepIndex >= i;
            const isCurrent = currentStepIndex === i;
            return (
              <div key={st.key} className="space-y-2">
                <div
                  className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-black shadow-glow scale-110'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-white/5 text-zinc-600 border border-white/10'
                  }`}
                >
                  {i + 1}
                </div>
                <span className={isCurrent ? 'text-amber-400 font-bold' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details & Customized Items */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items */}
        <div className="md:col-span-8 p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4 shadow-subtle">
          <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>Configured Commission Items ({order.items.length})</span>
          </h3>

          <div className="divide-y divide-white/5 space-y-4">
            {order.items.map((it) => {
              let customSpecs = {};
              try {
                customSpecs = JSON.parse(it.customizationDetails || '{}');
              } catch {}

              const specKeys = Object.keys(customSpecs);

              return (
                <div key={it.id} className="pt-4 first:pt-0 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">{it.productName}</h4>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        Quantity: {it.quantity} • Unit: ₹{(it.unitPrice + it.customizationPrice).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-bold text-amber-400">
                      ₹{it.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {specKeys.length > 0 && (
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] space-y-1">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        Custom Slicing Specifications:
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {specKeys.map((k) => (
                          <span key={k} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">
                            <strong className="text-zinc-400 capitalize">{k.replace(/_/g, ' ')}:</strong>{' '}
                            {typeof (customSpecs as any)[k] === 'object'
                              ? JSON.stringify((customSpecs as any)[k])
                              : String((customSpecs as any)[k])}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Subtotal</span>
              <span className="font-mono text-white">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>White-Glove Shipping</span>
              <span className="font-mono text-emerald-400">
                {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-base font-bold text-white">
              <span>Total Paid / Payable</span>
              <span className="font-mono text-amber-400 text-lg">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Destination & WhatsApp Action */}
        <div className="md:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4 shadow-subtle text-xs">
            <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Delivery Details</span>
            </h3>

            <div className="space-y-1 text-zinc-300">
              <p className="font-bold text-white">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.city}, {order.state} - {order.postalCode}</p>
              <p className="text-zinc-400 font-mono mt-1">Phone: {order.customerPhone}</p>
              <p className="text-zinc-400">Email: {order.customerEmail}</p>
            </div>

            <div className="pt-2 border-t border-white/5">
              <span className="text-[10px] text-zinc-500 font-mono uppercase block">Payment Method</span>
              <span className="font-semibold text-white mt-0.5 block">{order.paymentMethod.replace(/_/g, ' ')}</span>
            </div>
          </div>

          {/* WhatsApp Direct Confirmation */}
          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <h3 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Studio WhatsApp Direct Line</span>
            </h3>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Notify our studio lead directly to accelerate CAD slicing analysis or coordinate immediate local pickup.
            </p>
            <a
              href={`https://wa.me/919876543210?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-subtle transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message Studio with Order #{order.orderNumber}</span>
            </a>
          </div>

          <div className="flex items-center justify-between text-xs pt-2">
            <Link
              href="/profile"
              className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View in My Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
