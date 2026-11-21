import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'VK STUDIO | 3D Printing & Customization Laboratory by Vamsi Krishna',
  description:
    'Bespoke additive manufacturing studio by Vamsi Krishna specializing in architectural models, kinetic sculptures, personalized lithophanes, and precision engineered 3D-printed creations.',
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
  keywords: [
    'VK STUDIO',
    'Vamsi Krishna',
    '3D Printing',
    'Custom 3D Printing',
    'vk_studi_o',
    'Lithophane Lamp',
    'Voronoi Lamp',
    '3D Printed Gifts',
    'Custom Nameplate',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-studio-bg text-studio-text antialiased min-h-screen flex flex-col selection:bg-amber-500 selection:text-black">
        <AuthProvider>
          <CartProvider>
            <AnnouncementBanner />
            <Navbar />
            <main className="flex-1">{children}</main>
            <CartDrawer />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
