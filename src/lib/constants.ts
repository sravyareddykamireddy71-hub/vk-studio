import { StudioSettings } from './types';

export const DEFAULT_SETTINGS: StudioSettings = {
  brandName: 'VK STUDIO',
  tagline: 'Premium 3D Printing & Bespoke Customization Studio by Vamsi Krishna',
  heroHeadline: 'Your Imagination. Our Creation.',
  heroSubheadline: 'Discover thoughtfully engineered 3D-printed masterpieces or bring your bespoke ideas to life with state-of-the-art precision customization from VK STUDIO by Vamsi Krishna.',
  heroBadge: 'Precision FDM & SLA Resin Fabrication',
  aboutTitle: 'Craftsmanship Meets High-Precision Additive Manufacturing',
  aboutDescription: 'VK STUDIO was founded by Vamsi Krishna with a single mission: bridging bespoke artisanal design with industrial-grade 3D printing technology. Every piece is carefully sliced, monitored across hundreds of micro-layers, hand-finished, and curated to perfection in our studio.',
  aboutPillars: [
    {
      title: 'Precision Layer Quality',
      desc: 'Sub-50 micron layer resolution utilizing aerospace-grade engineering filaments and ultra-high-definition DLP resins.',
      icon: 'Layers'
    },
    {
      title: 'Tailored Customization',
      desc: 'From custom typography to structural CAD alterations, every order is tailored to exact client specifications.',
      icon: 'Sliders'
    },
    {
      title: 'Sustainable Polymers',
      desc: 'Eco-conscious bioplastics, reinforced carbon-fiber filaments, and durable architectural compounds.',
      icon: 'ShieldCheck'
    },
    {
      title: 'Direct Artisan Dialogue',
      desc: 'Live consultation and order refinement directly via our studio WhatsApp workbench for immediate feedback.',
      icon: 'MessageSquare'
    }
  ],
  whatsappNumber: process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '+91 98765 43210',
  instagramUrl: 'https://instagram.com/vk_studi_o',
  contactEmail: 'contact@vkstudio.design',
  contactPhone: process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '+91 98765 43210',
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
