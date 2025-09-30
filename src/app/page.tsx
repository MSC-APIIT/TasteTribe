'use client';

import * as React from 'react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import FoodHeroAnimation from '@/components/ui/FoodHeroAnimation';
import FoodShowcase from '@/components/ui/FoodShowCase';
import PopularDishes from './popularDishes.fragment';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-foreground min-h-screen overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        </div>

        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-500/20 dark:bg-orange-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-red-500/20 dark:bg-red-500/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-yellow-500/20 dark:bg-yellow-500/30 rounded-full blur-xl animate-pulse delay-500"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mt-20 mb-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                Welcome to TasteTribe!
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6">
                Discover, rate, and comment on the best food in the city...
              </p>

              <div className="w-full h-64 border border-border rounded-lg flex items-center justify-center text-muted-foreground bg-background/50 backdrop-blur-sm shadow-inner">
                <FoodHeroAnimation />
              </div>
            </div>
            <div className="lg:w-1/2 w-full h-full flex items-stretch">
              <FoodShowcase />
            </div>
          </div>

          <div className="relative mb-12">
            <input
              type="text"
              placeholder="Search for stalls or dishes..."
              className="w-full px-4 py-3 bg-background/80 border-2 border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 backdrop-blur-sm shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xl" />
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <PopularDishes />
    </>
  );
}
