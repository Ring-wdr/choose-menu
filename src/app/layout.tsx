import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import Header from '@/components/Header';
import { ThemeProvider } from '@/components/Theme-provider';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '메뉴 정하는 페이지',
  description: '메뉴 고르기용 페이지',
  appleWebApp: {
    statusBarStyle: 'black-translucent',
  },
};
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          nonce=""
        >
          <Header />
          {children}
          {modal}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
