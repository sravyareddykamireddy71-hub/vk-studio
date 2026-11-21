'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ArrowRight,
  Filter,
  DollarSign,
  Package,
} from 'lucide-react';
import { REQUEST_STATUS_LABELS } from '@/lib/constants';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  // Inspector modal fields
  const [modalStatus, setModalStatus] = useState('');
  const [modalFinalQuote, setModalFinalQuote] = useState('');
  const [modalAdminNotes, setModalAdminNotes] = useState('');
  const [modalAdminResponse, setModalAdminResponse] = useState('');
  const [saving, setSaving] = useState(false);
  const [convertSuccess, setConvertSuccess] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const url = statusFilter !== 'ALL' ? `/api/requests?status=${statusFilter}` : '/api/requests';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const openInspector = (req: any) => {
    setSelectedRequest(req);
    setModalStatus(req.status);
    setModalFinalQuote(req.finalQuote?.toString() || req.estimatedPrice?.toString() || '');
    setModalAdminNotes(req.adminNotes || '');
    setModalAdminResponse(req.adminResponse || '');
    setConvertSuccess(null);
  };

  const handleSaveRequest = async (actionOverride?: string) => {
    if (!selectedRequest) return;
    setSaving(true);

    try {
      const payload: any = {
        status: actionOverride === 'CONVERT_TO_ORDER' ? 'CONVERTED_TO_ORDER' : modalStatus,
        finalQuote: modalFinalQuote ? parseFloat(modalFinalQuote) : null,
        adminNotes: modalAdminNotes,
        adminResponse: modalAdminResponse,
      };

      if (actionOverride === 'CONVERT_TO_ORDER') {
        payload.action = 'CONVERT_TO_ORDER';
      }

      const res = await fetch(`/api/requests/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.request) {
        if (data.order) {
          setConvertSuccess(`Successfully converted to Order #${data.order.orderNumber}!`);
        }
        await fetchRequests();
        setSelectedRequest(data.request);
      } else {
        alert(data.error || 'Failed to update request');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating request');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-white tracking-tight">
            Customization & Slicing Requests
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Review customer CAD submissions, prepare slicing quotes, and convert approved commissions into active orders.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-studio-surface border border-white/10 text-xs text-white outline-none focus:border-amber-500 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW_REQUEST">New Request</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="AWAITING_CUSTOMER">Awaiting Customer</option>
            <option value="QUOTE_SENT">Quote Sent</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CONVERTED_TO_ORDER">Converted to Order</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="rounded-2xl bg-studio-surface border border-white/10 overflow-hidden shadow-subtle">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">
            Fetching customization requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-400">
            No customization requests matching this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-black/40 text-[10px] font-mono uppercase tracking-wider text-zinc-400 border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Project / Product</th>
                  <th className="py-3 px-4">Quote / Estimate</th>
                  <th className="py-3 px-4">Attached CAD</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map((req) => {
                  const statusCfg = REQUEST_STATUS_LABELS[req.status] || {
                    label: req.status,
                    color: 'bg-zinc-800 text-zinc-300',
                  };

                  return (
                    <tr key={req.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {req.referenceNumber}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{req.customerName}</span>
                        <span className="text-[10px] text-zinc-400 font-mono block">
                          {req.customerEmail}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-amber-300 block">{req.productTitle}</span>
                        <span className="text-[10px] text-zinc-500 font-mono block">
                          Qty: {req.quantity}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        {req.finalQuote ? (
                          <span className="text-emerald-400 font-bold">
                            ₹{req.finalQuote.toLocaleString('en-IN')}
                          </span>
                        ) : req.estimatedPrice ? (
                          <span className="text-zinc-400">
                            ₹{req.estimatedPrice.toLocaleString('en-IN')} (Est.)
                          </span>
                        ) : (
                          <span className="text-zinc-500 italic">Pending Slicing</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {req.referenceFileUrl ? (
                          <a
                            href={req.referenceFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline font-mono"
                          >
                            <span>Download File</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-zinc-500">None attached</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openInspector(req)}
                          className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-[11px] font-semibold transition-all"
                        >
                          Inspect & Quote
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

      {/* Request Inspector Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-studio-card border border-white/15 rounded-3xl shadow-premium p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
                  Customization Workbench
                </span>
                <h2 className="font-display font-black text-xl text-white tracking-tight mt-0.5">
                  Request {selectedRequest.referenceNumber}
                </h2>
                <p className="text-xs text-zinc-400">{selectedRequest.productTitle}</p>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {convertSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{convertSuccess}</span>
              </div>
            )}

            {/* Customer Details & Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Customer Information</span>
                <p className="font-bold text-white text-sm">{selectedRequest.customerName}</p>
                <p className="text-zinc-400">{selectedRequest.customerEmail}</p>
                {selectedRequest.customerPhone && (
                  <p className="text-amber-400 font-mono">{selectedRequest.customerPhone}</p>
                )}
                {selectedRequest.customerPhone && (
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${selectedRequest.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${selectedRequest.customerName}, this is VK STUDIO regarding your commission request #${selectedRequest.referenceNumber}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Quantity & Files</span>
                <p className="font-mono text-white text-sm font-bold">Qty: {selectedRequest.quantity}</p>
                {selectedRequest.referenceFileUrl ? (
                  <a
                    href={selectedRequest.referenceFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 font-mono pt-1"
                  >
                    <span>Download Attached CAD / Image</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="text-zinc-500 italic">No CAD file uploaded</p>
                )}
              </div>
            </div>

            {/* Submitted Customization Specs */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                Submitted Specifications & Instructions:
              </span>
              <div className="space-y-1 text-zinc-300">
                {Object.entries(selectedRequest.customizationDetails || {}).map(([k, v]) => (
                  <div key={k}>
                    <strong className="text-zinc-400 capitalize">{k.replace(/_/g, ' ')}:</strong>{' '}
                    <span>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                  </div>
                ))}
              </div>
              {selectedRequest.customerInstructions && (
                <div className="pt-2 border-t border-white/5">
                  <strong className="text-zinc-400">Customer Notes:</strong>
                  <p className="text-zinc-200 mt-0.5 italic">&ldquo;{selectedRequest.customerInstructions}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Admin Controls */}
            <div className="space-y-4 pt-2 border-t border-white/10 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Request Status</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-white/10 text-white outline-none focus:border-amber-500"
                  >
                    <option value="NEW_REQUEST">New Request</option>
                    <option value="UNDER_REVIEW">Under Review (CAD Slicing)</option>
                    <option value="AWAITING_CUSTOMER">Awaiting Customer Reply</option>
                    <option value="QUOTE_SENT">Quote Sent</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="CONVERTED_TO_ORDER">Converted to Order</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Final Studio Quote (₹)</label>
                  <input
                    type="number"
                    value={modalFinalQuote}
                    onChange={(e) => setModalFinalQuote(e.target.value)}
                    placeholder="e.g. 2400"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-zinc-300 font-medium block mb-1">Response / Quote Message to Customer</label>
                  <textarea
                    rows={2}
                    value={modalAdminResponse}
                    onChange={(e) => setModalAdminResponse(e.target.value)}
                    placeholder="e.g. Slicing estimate verified at 0.12mm layer height. Quote updated to ₹2,400 including brass inserts."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-zinc-300 font-medium block mb-1">Internal Studio Notes (Private)</label>
                  <input
                    type="text"
                    value={modalAdminNotes}
                    onChange={(e) => setModalAdminNotes(e.target.value)}
                    placeholder="e.g. Bambu Plate #2, print with tree supports."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => handleSaveRequest('CONVERT_TO_ORDER')}
                disabled={saving || selectedRequest.status === 'CONVERTED_TO_ORDER'}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-subtle"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Convert to Active Order</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-zinc-300 text-xs"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveRequest()}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs shadow-subtle"
                >
                  {saving ? 'Updating...' : 'Save Request Updates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
