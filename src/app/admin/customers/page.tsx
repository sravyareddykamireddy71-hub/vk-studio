import React from 'react';
import { Users, Mail, Phone, ShoppingBag, MapPin, MessageCircle } from 'lucide-react';
import prisma from '@/lib/prisma';

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: {
      orders: { select: { totalAmount: true } },
      customizationRequests: { select: { id: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl text-white tracking-tight">
          Customer Directory & Patrons
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          View registered customer accounts, commission records, and initiate direct communication.
        </p>
      </div>

      <div className="rounded-2xl bg-studio-surface border border-white/10 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-black/40 text-[10px] font-mono uppercase tracking-wider text-zinc-400 border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Shipping Destination</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((c) => {
                const totalSpend = c.orders.reduce((sum, o) => sum + o.totalAmount, 0);
                const cleanPhone = (c.phone || '').replace(/[^0-9]/g, '');

                return (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center font-mono text-xs">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-white">{c.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-400">{c.email}</td>

                    <td className="py-3 px-4 font-mono text-zinc-300">
                      {c.phone || <span className="text-zinc-600 italic">Not set</span>}
                    </td>

                    <td className="py-3 px-4 font-mono text-white">
                      {c.orders.length} {c.orders.length === 1 ? 'order' : 'orders'}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      ₹{totalSpend.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-zinc-400 max-w-xs truncate">
                      {c.address || <span className="text-zinc-600 italic">No saved address</span>}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {c.phone ? (
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${c.name}, greetings from VK STUDIO!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      ) : (
                        <span className="text-zinc-600 text-[10px] italic">No phone</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
