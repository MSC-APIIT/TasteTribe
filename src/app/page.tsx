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
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mt-20 mb-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Welcome to TasteTribe!
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Discover, rate, and comment on the best food in the city...
              </p>

              {/* Add animation/vector here */}
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                <FoodHeroAnimation />{' '}
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
              className="w-full px-4 py-3 border border-border rounded-lg bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
          </div>

          {/* Menu Items Section */}
          <div className="space-y-8">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-secondary text-card-foreground rounded-lg shadow-md p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 border border-border"
              >
                {/* Image Slider (Left Side) */}
                <div className="relative">
                  {/* Add image navigation here */}
                  <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
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
                    <h2 className="text-2xl font-semibold text-secondary-foreground">
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
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Your Rating:
                    </h3>
                    <div className="flex text-3xl text-gray-300">
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
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Comments
                    </h3>
                    <div className="max-h-40 overflow-y-auto space-y-4 pr-2">
                      {item.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-card text-card-foreground rounded-lg shadow-md p-4 border border-border"
                        >
                          <p className="font-semibold">{comment.user}</p>
                          <p className="text-muted-foreground">
                            {comment.text}
                          </p>

                          {comment.replies.length > 0 && (
                            <div className="ml-4 mt-2 space-y-2">
                              {comment.replies.map((reply) => (
                                <div
                                  key={reply.id}
                                  className="bg-gray-100 p-2 rounded-md text-sm"
                                >
                                  <p className="font-semibold text-gray-800">
                                    {reply.user}
                                  </p>
                                  <p className="text-gray-700">{reply.text}</p>
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
                        className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
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
      </div>
    </>
  );
}
