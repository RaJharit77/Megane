import type { Metadata } from 'next';
import { Poppins, Dancing_Script } from 'next/font/google';
import '@/style/globals.css';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/next';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
});

export const metadata: Metadata = {
  title: 'Megane-Flow-Gen - Fleur Magique d\'Amour',
  description: 'Créez une fleur réaliste unique avec un message personnalisé pour votre être cher.',
  icons: {
    icon: '/ico/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${poppins.variable} ${dancingScript.variable} antialiased`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#5a3d5c',
              boxShadow: '0 10px 25px -5px rgba(255,77,109,0.2)',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
            },
            success: {
              icon: '✨',
              style: { border: '1px solid #ff4d6d' },
            },
            error: {
              icon: '❌',
              style: { border: '1px solid #e63946' },
            },
            loading: { icon: '⏳' },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}