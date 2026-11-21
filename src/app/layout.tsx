import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('vk_theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-studio-bg text-studio-text antialiased min-h-screen flex flex-col selection:bg-lime-400 selection:text-black relative">
        {/* Cinematic Ambient 3D Printing Studio Background Layer */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="/images/bg-3d-printer.jpg"
            alt="VK STUDIO 3D Printing Mechanics"
            className="w-full h-full object-cover object-center opacity-30 dark:opacity-20 scale-105 animate-slow-pan transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-studio-bg/60 via-studio-bg/85 to-studio-bg pointer-events-none" />
        </div>

        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <AnnouncementBanner />
              <Navbar />
              <main className="flex-1 relative z-10">{children}</main>
              <CartDrawer />
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
