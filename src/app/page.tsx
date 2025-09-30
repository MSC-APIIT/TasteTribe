'use client';

import * as React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import FoodHeroAnimation from '@/components/ui/FoodHeroAnimation';
import FoodShowcase from '@/components/ui/FoodShowCase';

interface MenuItem {
  id: number;
  name: string;
  images: string[];
  averageRating: number;
  description: string;
  price: string;
  stallName: string;
  stallOverallRating: number;
  comments: Comment[];
}

interface Comment {
  id: number;
  user: string;
  text: string;
  replies: Comment[];
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API calls later
  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Delicious Burger',
      images: ['/burger1.jpg', '/burger2.jpg'],
      averageRating: 4.5,
      description: 'A juicy burger with all the fixings.',
      price: '$12.99',
      stallName: 'Burger Joint',
      stallOverallRating: 4.7,
      comments: [
        {
          id: 101,
          user: 'User1',
          text: 'This burger is amazing!',
          replies: [],
        },
        {
          id: 102,
          user: 'User2',
          text: 'Loved the patty!',
          replies: [
            {
              id: 103,
              user: 'User3',
              text: 'Me too, so flavorful!',
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Spicy Tacos',
      images: ['/tacos1.jpg'],
      averageRating: 4.0,
      description: 'Three spicy tacos with your choice of filling.',
      price: '$9.50',
      stallName: 'Taco Truck',
      stallOverallRating: 4.2,
      comments: [
        {
          id: 201,
          user: 'User4',
          text: 'Great heat!',
          replies: [],
        },
      ],
    },
    {
      id: 3,
      name: 'Blueberry Mojito',
      images: ['/mojito1.jpg'],
      averageRating: 4.0,
      description: 'Blueberry Mojito with your choice of chilling.',
      price: '$6.50',
      stallName: 'Mojito Truck',
      stallOverallRating: 4.2,
      comments: [
        {
          id: 201,
          user: 'User4',
          text: 'Great heat!',
          replies: [],
        },
      ],
    },
    // Add more mock menu items as needed
  ];

  return (
    <>
      {/* Hero Section - Theme-aware Background with Professional Styling */}
      <section className="relative bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-foreground min-h-screen overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-500/20 dark:bg-orange-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-red-500/20 dark:bg-red-500/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-yellow-500/20 dark:bg-yellow-500/30 rounded-full blur-xl animate-pulse delay-500"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
          {/* Hero Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mt-20 mb-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                Welcome to TasteTribe!
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6">
                Discover, rate, and comment on the best food in the city...
              </p>

              {/* Animation/vector container */}
              <div className="w-full h-64 border border-border rounded-lg flex items-center justify-center text-muted-foreground bg-background/50 backdrop-blur-sm shadow-inner">
                <FoodHeroAnimation />
              </div>
            </div>
            <div className="lg:w-1/2 w-full h-full flex items-stretch">
              <FoodShowcase />
            </div>
          </div>

          {/* Search Bar */}
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

      {/* Menu Items Section - Theme-aware Background */}
      <section className="bg-gray-50/50 dark:bg-slate-800/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Dishes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse and rate the most popular dishes from local food stalls
            </p>
          </div>

          {/* Menu Items */}
          <div className="space-y-8">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 border border-border"
              >
                {/* Image Slider (Left Side) */}
                <div className="relative">
                  <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                    {item.images.map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    ))}
                  </div>
                  {/* Navigation arrows */}
                </div>

                {/* Menu Item Details and Rating (Right Side) */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-semibold text-card-foreground">
                      {item.name}
                    </h2>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="mr-1">{item.stallName}</span>
                      <FaStar className="text-yellow-400 mr-0.5" />
                      <span>{item.stallOverallRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex text-xl text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.round(item.averageRating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium text-muted-foreground">
                      {item.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {item.description}
                  </p>
                  <p className="text-xl font-bold text-green-600 mb-6">
                    {item.price}
                  </p>

                  {/* Rate Star Input */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-card-foreground mb-2">
                      Your Rating:
                    </h3>
                    <div className="flex text-3xl text-muted-foreground">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className="cursor-pointer hover:text-yellow-400 transition-colors duration-200"
                          // Add onClick to handle rating input
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="border-t border-border pt-4">
                    <h3 className="text-lg font-medium text-card-foreground mb-4">
                      Comments
                    </h3>
                    <div className="max-h-40 overflow-y-auto space-y-4 pr-2">
                      {item.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-50 rounded-lg shadow-sm p-4 border border-gray-100"
                        >
                          <p className="font-semibold text-card-foreground">
                            {comment.user}
                          </p>
                          <p className="text-muted-foreground">
                            {comment.text}
                          </p>

                          {comment.replies.length > 0 && (
                            <div className="ml-4 mt-2 space-y-2">
                              {comment.replies.map((reply) => (
                                <div
                                  key={reply.id}
                                  className="bg-white p-2 rounded-md text-sm border border-gray-100"
                                >
                                  <p className="font-semibold text-secondary-foreground">
                                    {reply.user}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {reply.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Add Reply button */}
                        </div>
                      ))}
                    </div>
                    {/* Add New Comment Input */}
                    <div className="mt-4">
                      <textarea
                        className="w-full p-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-orange-500"
                        rows={2}
                        placeholder="Add your comment..."
                      ></textarea>

                      <button className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
