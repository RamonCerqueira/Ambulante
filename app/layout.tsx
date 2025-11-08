/**
 * Layout raiz da aplicação
 * Configuração de metadados, providers e estrutura base
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Street Vendor Connect - Comércio Ambulante',
  description: 'Plataforma para conectar comerciantes ambulantes com clientes através de geolocalização',
  keywords: 'ambulante, comércio, geolocalização, pedidos, delivery',
  authors: [{ name: 'Street Vendor Team' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#FF6B35" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Wrapper da aplicação */}
        <div id="app" className="min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}

