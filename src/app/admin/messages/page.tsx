'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, MessageCircle, Check, Mail, Phone } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleStatus = async (msg: any) => {
    const nextStatus = msg.status === 'REPLIED' ? 'UNREAD' : 'REPLIED';
    try {
      const res = await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, status: nextStatus }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: nextStatus } : m))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl text-white tracking-tight">
          Customer Inquiries & Messages
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          General studio inquiries, CAD consultation requests, and direct customer communication.
        </p>
      </div>

      <div className="rounded-2xl bg-studio-surface border border-white/10 overflow-hidden shadow-subtle">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">Loading inquiries...</div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-400">No customer messages received yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {messages.map((msg) => (
              <div key={msg.id} className="p-6 space-y-3 hover:bg-white/5 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-white text-sm">{msg.name}</span>
                    <span className="text-zinc-400 ml-2 font-mono">{msg.email}</span>
                    {msg.phone && <span className="text-amber-400 ml-2 font-mono">{msg.phone}</span>}
                  </div>
                  <span className="text-zinc-500 font-mono text-[11px]">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-300">
                  <p className="font-semibold text-amber-300 mb-1">{msg.subject}</p>
                  <p className="leading-relaxed">{msg.message}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    onClick={() => toggleStatus(msg)}
                    className={`px-2.5 py-1 rounded-md font-mono text-[10px] font-bold border transition-all ${
                      msg.status === 'REPLIED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    Status: {msg.status}
                  </button>

                  {msg.phone && (
                    <a
                      href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${msg.name}, thank you for contacting VK STUDIO regarding "${msg.subject}".`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Reply on WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
