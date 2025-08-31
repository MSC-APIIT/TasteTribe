import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';
import ThemeSwitch from '@/components/home/themeSwitch';
import LeftDrawer from '@/components/home/LeftDrawer';
import Header from '@/components/home/Header';

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeSwitch className="fixed top-4 right-4 z-50" />
          <LeftDrawer className="fixed top-4 left-4 z-50" />
          <Header />

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
