import { StudioSettings } from './types';

export const DEFAULT_SETTINGS: StudioSettings = {
  brandName: 'VK STUDIO',
  tagline: 'Custom 3D Printing & Personalized Gifts by Vamsi Krishna',
  heroHeadline: 'Your Imagination, My Creation',
  heroSubheadline: 'Turn your ideas, names, and custom designs into real 3D printed items you can hold. From personalized nameplates and keychains to desk accessories and unique gifts.',
  heroBadge: '100% Custom 3D Printing & Personalized Gifts',
  aboutTitle: 'Personalized 3D Printing Done Right',
  aboutDescription: 'VK STUDIO is a specialized 3D printing workshop run by Vamsi Krishna. We focus 100% on high-quality 3D printed products and bespoke custom designs. Every single piece is 3D printed layer-by-layer using premium, durable filaments made to last.',
  aboutPillars: [
    {
      title: 'Crisp 3D Print Quality',
      desc: 'Clean, smooth layers printed with strong, eco-friendly PLA and PETG filaments.',
      icon: 'Layers'
    },
    {
      title: 'Custom Names & Colors',
      desc: 'Add your own text, choose your favorite colors, and preview sizes easily.',
      icon: 'Sliders'
    },
    {
      title: 'Pure 3D Printing',
      desc: 'We specialize strictly in authentic 3D printed creations — zero resin crafts or generic molds.',
      icon: 'ShieldCheck'
    },
    {
      title: 'WhatsApp Direct Chat',
      desc: 'Direct conversation with Vamsi Krishna on WhatsApp for orders, previews, and fast support.',
      icon: 'MessageSquare'
    }
  ],
  whatsappNumber: process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '+91 91004 84870',
  instagramUrl: 'https://instagram.com/vk_studi_o',
  contactEmail: 'contact@vkstudio.design',
  contactPhone: process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '+91 91004 84870',
  studioAddress: 'VK Studio, Bengaluru, Karnataka, India',
  workingHours: 'Monday – Saturday: 10:00 AM – 8:00 PM IST',
  announcementText: '✨ Accepting Custom Commissions & Bulk Orders — Follow @vk_studi_o on Instagram!',
  showAnnouncement: true,
};

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string; step: number }> = {
  ORDER_RECEIVED: { label: 'Order Received', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', step: 1 },
  CONFIRMED: { label: 'Order Confirmed', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', step: 2 },
  IN_PRODUCTION: { label: '3D Printing in Progress', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', step: 3 },
  QUALITY_CHECK: { label: 'Post-Processing & QA', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', step: 4 },
  READY_FOR_DISPATCH: { label: 'Cured & Packaged', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20', step: 5 },
  SHIPPED: { label: 'Dispatched / In Transit', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', step: 6 },
  DELIVERED: { label: 'Delivered', color: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40', step: 7 },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/20', step: 0 },
};

export const REQUEST_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NEW_REQUEST: { label: 'New Request', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  UNDER_REVIEW: { label: 'Studio Reviewing CAD', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  AWAITING_CUSTOMER: { label: 'Awaiting Customer Reply', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  QUOTE_SENT: { label: 'Studio Quote Sent', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  APPROVED: { label: 'Design Approved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  REJECTED: { label: 'Declined / Infeasible', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  CONVERTED_TO_ORDER: { label: 'Converted to Order', color: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40' },
};
