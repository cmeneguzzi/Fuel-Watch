import { Syne, DM_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-dm-mono',
});

export const metadata = {
  title: 'Fuel Watch — South America',
  description: 'Monitoramento em tempo real de preços de combustíveis — Brasil, Argentina, Chile e Petróleo Brent',
  keywords: ['combustível', 'diesel', 'gasolina', 'preço', 'Brasil', 'Argentina', 'Chile', 'Brent', 'ANP'],
  authors: [{ name: 'Fuel Watch' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fuel Watch',
  },
  openGraph: {
    title: 'Fuel Watch — South America',
    description: 'Preços de combustíveis em tempo real: Brasil · Argentina · Chile · Brent',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fuel Watch — South America',
    description: 'Preços de combustíveis em tempo real: Brasil · Argentina · Chile · Brent',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0b0c10',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${dmMono.variable}`}>
      <head>
        {/* PWA / Apple */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0b0c10" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Fuel Watch" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-startup-image" href="/icon-512.png" />

        {/* Mobile */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Fuel Watch" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#0b0c10" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
