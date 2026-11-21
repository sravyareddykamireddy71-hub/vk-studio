'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, Trash2, Eye, EyeOff, Plus, MessageSquare } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New review modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews?all=true');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        if (data.products?.length > 0) setSelectedProductId(data.products[0].id);
      })
      .catch(console.error);
  }, []);

  const togglePublish = async (rev: any) => {
    try {
      const res = await fetch(`/api/reviews/${rev.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !rev.isPublished }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === rev.id ? { ...r, isPublished: !r.isPublished } : r))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer review?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !authorName || !reviewText) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductId,
          authorName,
          rating,
          reviewText,
        }),
      });
      if (res.ok) {
        await fetchReviews();
        setShowAddModal(false);
        setAuthorName('');
        setReviewText('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-white tracking-tight">
            Review Moderation & Feedback
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Moderate verified customer impressions, publish or unpublish feedback, and add studio testimonials.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-subtle self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Verified Review</span>
        </button>
      </div>

      <div className="rounded-2xl bg-studio-surface border border-white/10 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-black/40 text-[10px] font-mono uppercase tracking-wider text-zinc-400 border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Design / Product</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Review Content</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{rev.authorName}</td>

                  <td className="py-3 px-4 font-semibold text-amber-300">
                    {rev.product?.name || 'General Studio Review'}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`}
                        />
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-xs truncate text-zinc-300 italic">
                    &ldquo;{rev.reviewText}&rdquo;
                  </td>

                  <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => togglePublish(rev)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all ${
                        rev.isPublished
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                      }`}
                    >
                      {rev.isPublished ? 'Published' : 'Hidden'}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePublish(rev)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
                        title={rev.isPublished ? 'Hide review' : 'Publish review'}
                      >
                        {rev.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-white/5"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleAddReview}
            className="w-full max-w-md bg-studio-card border border-white/15 rounded-3xl p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base">Add Verified Review</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-zinc-300 font-medium block mb-1">Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-studio-surface border border-white/10 text-white outline-none focus:border-amber-500"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-medium block mb-1">Customer / Author Name</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-medium block mb-1">Rating</label>
              <div className="flex items-center gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1"
                  >
                    <Star
                      className={`w-5 h-5 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-zinc-300 font-medium block mb-1">Review Content</label>
              <textarea
                rows={3}
                required
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold"
              >
                {submitting ? 'Adding...' : 'Save Review'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
