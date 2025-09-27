import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';
import ThemeSwitch from '@/components/home/themeSwitch';
import LeftDrawer from '@/components/home/LeftDrawer';
import Header from '@/components/home/Header';
import { Toaster } from 'react-hot-toast';
import SessionModal from '@/components/Auth/SessionTimeout/SessionModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TasteTribe',
  description: 'by Sahan Dilshan',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        {/* You can add more sizes or formats here */}
      </head>

      <body className={inter.className}>
        <div className="bg-white dark:bg-slate-800 text-foreground min-h-screen">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-right" />
            <ThemeSwitch className="fixed top-4 right-4 z-50" />
            <LeftDrawer className="fixed top-4 left-4 z-50" />
            <Header />
            <SessionModal />
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
