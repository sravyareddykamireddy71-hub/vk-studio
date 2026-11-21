'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, MessageCircle, Instagram, Globe, Sparkles } from 'lucide-react';
import { StudioSettings } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/constants';

export default function AdminContentPage() {
  const [settings, setSettings] = useState<StudioSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs font-mono text-zinc-500">Loading settings...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-16">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display font-black text-2xl text-white tracking-tight">
            Website Content & Studio CMS
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure live homepage hero headlines, WhatsApp numbers, announcement banners, and studio details without code changes.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Website content updated immediately on the live storefront!</span>
        </div>
      )}

      {/* 1. Announcement Banner */}
      <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4 text-xs">
        <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>1. Global Website Announcement Banner</span>
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
            <input
              type="checkbox"
              checked={settings.showAnnouncement}
              onChange={(e) => setSettings({ ...settings, showAnnouncement: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 bg-white/5 border-white/10"
            />
            <span>Show Announcement Banner at Top of Website</span>
          </label>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">Banner Text</label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4 text-xs">
        <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span>2. Hero Landing Section</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-zinc-300 font-medium block mb-1">Pill Badge Text</label>
            <input
              type="text"
              value={settings.heroBadge}
              onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-zinc-300 font-medium block mb-1">Hero Main Headline</label>
            <input
              type="text"
              value={settings.heroHeadline}
              onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-zinc-300 font-medium block mb-1">Supporting Subheadline Description</label>
            <textarea
              rows={3}
              value={settings.heroSubheadline}
              onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 3. About Studio */}
      <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4 text-xs">
        <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold">
          3. About VK STUDIO Story
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-zinc-300 font-medium block mb-1">About Section Title</label>
            <input
              type="text"
              value={settings.aboutTitle}
              onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">About Section Story & Philosophy</label>
            <textarea
              rows={4}
              value={settings.aboutDescription}
              onChange={(e) => setSettings({ ...settings, aboutDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 4. Contact & WhatsApp */}
      <div className="p-6 rounded-2xl bg-studio-surface border border-white/10 space-y-4 text-xs">
        <h3 className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>4. Official WhatsApp & Social Channels</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-zinc-300 font-medium block mb-1">
              Studio WhatsApp Business Number (Click-to-Chat) *
            </label>
            <input
              type="text"
              required
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">Official Instagram URL</label>
            <input
              type="url"
              value={settings.instagramUrl}
              onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">Studio Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-zinc-300 font-medium block mb-1">Working Hours</label>
            <input
              type="text"
              value={settings.workingHours}
              onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-zinc-300 font-medium block mb-1">Studio Physical Workshop Address</label>
            <input
              type="text"
              value={settings.studioAddress}
              onChange={(e) => setSettings({ ...settings, studioAddress: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
