import React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Sparkles,
  Box,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  TrendingUp,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { ORDER_STATUS_LABELS, REQUEST_STATUS_LABELS } from '@/lib/constants';

export const revalidate = 0;

async function getAdminOverviewData() {
  const [
    totalCustomers,
    totalProducts,
    orders,
    customRequests,
    recentReviews,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count(),
    prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.customizationRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
  ]);

  // Aggregate metrics
  const allOrders = await prisma.order.findMany({
    select: { totalAmount: true, productionStatus: true },
  });

  const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = allOrders.length;
  const inProductionCount = allOrders.filter(
    (o) => o.productionStatus === 'IN_PRODUCTION' || o.productionStatus === 'QUALITY_CHECK'
  ).length;
  const pendingRequestsCount = await prisma.customizationRequest.count({
    where: { status: 'NEW_REQUEST' },
  });

  return {
    totalCustomers,
    totalProducts,
    totalRevenue,
    totalOrdersCount,
    inProductionCount,
    pendingRequestsCount,
    recentOrders: orders,
    recentRequests: customRequests,
    recentReviews,
  };
}

export default async function AdminDashboardPage() {
  const data = await getAdminOverviewData();

  const metrics = [
    {
      label: 'Total Revenue',
      value: `₹${data.totalRevenue.toLocaleString('en-IN')}`,
      sub: 'All confirmed orders',
      icon: DollarSign,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Total Orders',
      value: data.totalOrdersCount,
      sub: 'Customer orders',
      icon: ShoppingBag,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Currently 3D Printing',
      value: data.inProductionCount,
      sub: 'Prints in progress',
      icon: Clock,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Custom Quote Requests',
      value: data.pendingRequestsCount,
      sub: 'Customer custom ideas',
      icon: Sparkles,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      label: '3D Products in Shop',
      value: data.totalProducts,
      sub: 'Active catalog items',
      icon: Box,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    },
    {
      label: 'Customers',
      value: data.totalCustomers,
      sub: 'Registered accounts',
      icon: Users,
      color: 'text-zinc-300 bg-white/5 border-white/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Brand Hero Card with Floating Logo & Saying */}
      <div className="rounded-3xl bg-white dark:bg-[#141618] border border-zinc-200 dark:border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm dark:shadow-premium relative overflow-hidden transition-colors">
        <div className="flex items-center gap-5">
          {/* Floating Logo with Luxury Badge Frame */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl p-1 bg-zinc-950 border-2 border-zinc-300 dark:border-white/20 shadow-md flex-shrink-0 animate-float-subtle ring-2 ring-black/5 dark:ring-white/5">
            <img
              src="/images/logo.jpg"
              alt="VK STUDIO - Vamsi Krishna"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest text-emerald-700 dark:text-lime-400 font-bold uppercase block">
              VK STUDIO • ADMIN WORKSPACE
            </span>
            <h1 className="font-display font-black text-2xl md:text-3xl text-zinc-950 dark:text-white tracking-tight">
              Your Imagination,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-lime-600 to-emerald-600 dark:from-lime-400 dark:to-emerald-300">
                My Creation
              </span>
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Welcome back, Vamsi Krishna. Manage 3D printed products, track printing orders, and respond to custom design requests.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-sm hover:shadow-glow hover:-translate-y-0.5 transition-all"
          >
            <Box className="w-4 h-4" />
            <span>+ Add New Product</span>
          </Link>
          <Link
            href="/admin/requests"
            className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white dark:border-white/15 font-semibold text-xs flex items-center gap-1.5 hover:-translate-y-0.5 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-700 dark:text-lime-400" />
            <span>Review Custom Requests</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-5 rounded-2xl bg-studio-surface border border-white/10 space-y-2 shadow-subtle"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 line-clamp-1">
                {m.label}
              </span>
              <div className={`p-1.5 rounded-lg border ${m.color}`}>
                <m.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="font-mono text-xl font-bold text-white tracking-tight">
              {m.value}
            </div>
            <span className="text-[10px] text-zinc-400 block truncate">{m.sub}</span>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Recent Orders & Recent Customization Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recent Customer Orders */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-5 shadow-subtle">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Recent Customer Orders</span>
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-white/5 space-y-3">
            {data.recentOrders.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No orders logged yet.</p>
            ) : (
              data.recentOrders.map((ord) => {
                const statusCfg = ORDER_STATUS_LABELS[ord.productionStatus] || {
                  label: ord.productionStatus,
                  color: 'bg-zinc-800 text-zinc-300',
                };

                return (
                  <div key={ord.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-xs">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{ord.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-[11px] truncate">
                        {ord.customerName} • {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-mono font-bold text-amber-400 block">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <Link
                        href={`/admin/orders`}
                        className="text-[10px] text-zinc-400 hover:text-white underline mt-0.5 inline-block"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Recent Bespoke Requests */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-5 shadow-subtle">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Custom Requests</span>
            </h3>
            <Link
              href="/admin/requests"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Quotes</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-white/5 space-y-3">
            {data.recentRequests.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No customization requests.</p>
            ) : (
              data.recentRequests.map((req) => {
                const statusCfg = REQUEST_STATUS_LABELS[req.status] || {
                  label: req.status,
                  color: 'bg-zinc-800 text-zinc-300',
                };

                return (
                  <div key={req.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-[11px]">{req.referenceNumber}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-zinc-300 font-semibold truncate text-[11px]">{req.productTitle}</p>
                      <p className="text-zinc-500 text-[10px] truncate">{req.customerName} ({req.customerEmail})</p>
                    </div>

                    <Link
                      href="/admin/requests"
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-amber-600 text-zinc-300 hover:text-white text-[10px] font-medium transition-all flex-shrink-0"
                    >
                      Inspect
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
