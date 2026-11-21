'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  Truck,
  CheckCircle2,
  Clock,
  Filter,
  DollarSign,
  Package,
  Search,
} from 'lucide-react';
import { ORDER_STATUS_LABELS } from '@/lib/constants';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Inspector modal state
  const [modalStatus, setModalStatus] = useState('');
  const [modalPaymentStatus, setModalPaymentStatus] = useState('');
  const [modalCourier, setModalCourier] = useState('');
  const [modalTracking, setModalTracking] = useState('');
  const [modalAdminNotes, setModalAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    try {
      const url = statusFilter !== 'ALL' ? `/api/orders?status=${statusFilter}` : '/api/orders';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const openInspector = (ord: any) => {
    setSelectedOrder(ord);
    setModalStatus(ord.productionStatus);
    setModalPaymentStatus(ord.paymentStatus);
    setModalCourier(ord.courier || '');
    setModalTracking(ord.trackingNumber || '');
    setModalAdminNotes(ord.adminNotes || '');
  };

  const handleSaveOrder = async () => {
    if (!selectedOrder) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productionStatus: modalStatus,
          paymentStatus: modalPaymentStatus,
          courier: modalCourier,
          trackingNumber: modalTracking,
          adminNotes: modalAdminNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        await fetchOrders();
        setSelectedOrder(data.order);
      } else {
        alert(data.error || 'Failed to update order');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating order');
    } finally {
      setSaving(false);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-white tracking-tight">
            Order Lifecycle & Production Management
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Track 3D slicing, machine printing, quality assurance, and courier dispatch.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search order #, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-studio-surface border border-white/10 text-xs text-white outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-studio-surface border border-white/10 text-xs text-white outline-none focus:border-amber-500 font-mono"
          >
            <option value="ALL">All Production Stages</option>
            <option value="ORDER_RECEIVED">Order Received</option>
            <option value="CONFIRMED">Order Confirmed</option>
            <option value="IN_PRODUCTION">3D Printing in Progress</option>
            <option value="QUALITY_CHECK">Quality Check & Curing</option>
            <option value="READY_FOR_DISPATCH">Ready for Dispatch</option>
            <option value="SHIPPED">Dispatched / In Transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-studio-surface border border-white/10 overflow-hidden shadow-subtle">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">
            Fetching studio orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-400">
            No orders found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-black/40 text-[10px] font-mono uppercase tracking-wider text-zinc-400 border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Production Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((ord) => {
                  const statusCfg = ORDER_STATUS_LABELS[ord.productionStatus] || {
                    label: ord.productionStatus,
                    color: 'bg-zinc-800 text-zinc-300',
                  };

                  return (
                    <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {ord.orderNumber}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{ord.customerName}</span>
                        <span className="text-[10px] text-zinc-400 font-mono block">
                          {ord.city}, {ord.state}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-zinc-200">
                          {ord.items.length} {ord.items.length === 1 ? 'Design' : 'Designs'}
                        </span>
                        <span className="text-[10px] text-zinc-500 block truncate max-w-[150px]">
                          {ord.items.map((it: any) => it.productName).join(', ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            ord.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openInspector(ord)}
                          className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-[11px] font-semibold transition-all"
                        >
                          Manage Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Inspector Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-studio-card border border-white/15 rounded-3xl shadow-premium p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
                  Order Management
                </span>
                <h2 className="font-display font-black text-xl text-white tracking-tight mt-0.5">
                  Order {selectedOrder.orderNumber}
                </h2>
                <p className="text-xs text-zinc-400">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Customer & Delivery Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Customer Details</span>
                <p className="font-bold text-white text-sm">{selectedOrder.customerName}</p>
                <p className="text-zinc-400">{selectedOrder.customerEmail}</p>
                <p className="text-amber-400 font-mono">{selectedOrder.customerPhone}</p>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedOrder.customerName}, this is VK STUDIO regarding your order #${selectedOrder.orderNumber}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Customer</span>
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Delivery Destination</span>
                <p className="text-white">{selectedOrder.shippingAddress}</p>
                <p className="text-zinc-400">{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postalCode}</p>
                {selectedOrder.customerNotes && (
                  <p className="text-amber-300 text-[11px] pt-1 italic">&ldquo;{selectedOrder.customerNotes}&rdquo;</p>
                )}
              </div>
            </div>

            {/* Items with Custom Specs */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                Ordered Items & Custom Slicing Specs ({selectedOrder.items.length}):
              </span>

              <div className="divide-y divide-white/5 space-y-3">
                {selectedOrder.items.map((it: any) => (
                  <div key={it.id} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{it.productName}</span>
                      <span className="font-mono text-amber-400 font-bold">₹{it.totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-zinc-400 font-mono text-[11px]">
                      Quantity: {it.quantity} • Unit Price: ₹{it.unitPrice}
                    </p>
                    {it.customizationDetails && Object.keys(it.customizationDetails).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {Object.entries(it.customizationDetails).map(([k, v]) => (
                          <span key={k} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-zinc-300">
                            <strong className="text-zinc-400 capitalize">{k.replace(/_/g, ' ')}:</strong>{' '}
                            {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Production & Tracking Controls */}
            <div className="space-y-4 pt-2 border-t border-white/10 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Production Workflow Stage</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-white/10 text-white outline-none focus:border-amber-500 font-mono"
                  >
                    <option value="ORDER_RECEIVED">1. Order Received</option>
                    <option value="CONFIRMED">2. Confirmed & Sliced</option>
                    <option value="IN_PRODUCTION">3. 3D Printing in Progress</option>
                    <option value="QUALITY_CHECK">4. Post-Processing & Quality Check</option>
                    <option value="READY_FOR_DISPATCH">5. Ready for Dispatch</option>
                    <option value="SHIPPED">6. Dispatched / In Transit</option>
                    <option value="DELIVERED">7. Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Payment Status</label>
                  <select
                    value={modalPaymentStatus}
                    onChange={(e) => setModalPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-white/10 text-white outline-none focus:border-amber-500 font-mono"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Courier Service</label>
                  <input
                    type="text"
                    value={modalCourier}
                    onChange={(e) => setModalCourier(e.target.value)}
                    placeholder="e.g. DTDC Express / Bluedart"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Tracking Number / AWB</label>
                  <input
                    type="text"
                    value={modalTracking}
                    onChange={(e) => setModalTracking(e.target.value)}
                    placeholder="e.g. VK-DTDC-99214"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-zinc-300 font-medium block mb-1">Internal Production Notes</label>
                  <input
                    type="text"
                    value={modalAdminNotes}
                    onChange={(e) => setModalAdminNotes(e.target.value)}
                    placeholder="e.g. Printed on Prusa MK4 with 0.15mm layer height. Packed in bubble casing."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-white/5 text-zinc-300 text-xs"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveOrder}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs shadow-subtle"
              >
                {saving ? 'Saving...' : 'Update Order Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
