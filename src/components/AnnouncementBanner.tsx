'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

export default function AnnouncementBanner() {
  const [show, setShow] = useState(true);
  const [text, setText] = useState('✨ Accepting Custom Studio Commissions — Free Shipping on Orders over ₹1,999!');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setShow(data.settings.showAnnouncement ?? true);
          if (data.settings.announcementText) {
            setText(data.settings.announcementText);
          }
        }
      })
      .catch(() => {});
  }, []);

  if (!show) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-amber-600/90 via-amber-700/90 to-zinc-900 px-4 py-2 text-xs md:text-sm text-white font-medium shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
          <span className="tracking-wide">{text}</span>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-amber-100 hover:text-white transition-colors p-1"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
