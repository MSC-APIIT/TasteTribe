'use client';

import * as React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import FoodHeroAnimation from '@/components/ui/FoodHeroAnimation';
import FoodShowcase from '@/components/ui/FoodShowCase';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/userAuth';

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

// Auth Modal Component
function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Modal Content */}
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <FaStar className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Join TasteTribe
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Sign in to rate dishes and share your thoughts with the community
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                // Navigate to login page
                window.location.href = '/auth/signin';
              }}
              className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Sign In
            </button>

            <button
              onClick={() => {
                // Navigate to signup page
                window.location.href = '/auth/signup';
              }}
              className="w-full px-6 py-3 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-semibold rounded-lg border-2 border-gray-300 dark:border-slate-600 transition-colors duration-200"
            >
              Create Account
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            New to TasteTribe? Create an account to get started
          </p>
        </div>
      </div>
    </div>
  );
}

// Skeleton component for loading state
function MenuItemSkeleton() {
  return (
    <div className="bg-card rounded-lg shadow-md p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 border border-border animate-pulse">
      {/* Image Skeleton */}
      <div className="relative">
        <div className="w-full h-64 bg-muted rounded-lg"></div>
      </div>

      {/* Details Skeleton */}
      <div>
        {/* Title and Stall Name */}
        <div className="flex justify-between items-start mb-2">
          <div className="h-8 bg-muted rounded w-2/3"></div>
          <div className="h-6 bg-muted rounded w-24"></div>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="h-6 bg-muted rounded w-32 mr-2"></div>
          <div className="h-6 bg-muted rounded w-12"></div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>

        {/* Price */}
        <div className="h-8 bg-muted rounded w-24 mb-6"></div>

        {/* Your Rating */}
        <div className="mb-6">
          <div className="h-6 bg-muted rounded w-32 mb-2"></div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-muted rounded"></div>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-border pt-4">
          <div className="h-6 bg-muted rounded w-24 mb-4"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-100 dark:border-slate-600"
              >
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
          {/* Comment Input Skeleton */}
          <div className="mt-4">
            <div className="h-20 bg-muted rounded mb-2"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { accessToken } = useAuth();
  const api = useApi(accessToken ?? undefined);

  // Fetch user's ratings for all menu items
  const fetchUserRatings = async (items: MenuItem[]) => {
    if (!accessToken) {
      return;
    }

    try {
      const ratingsPromises = items.map(async (item) => {
        try {
          const data = await api.get<{
            userRating?: number;
            averageRating?: number;
          }>(`/api/menuRatings?menuId=${item.id}`);
          return { menuId: item.id, rating: data.userRating || 0 };
        } catch (err) {
          console.error(`Failed to fetch rating for menu ${item.id}:`, err);
          return { menuId: item.id, rating: 0 };
        }
      });

      const ratingsData = await Promise.all(ratingsPromises);

      const ratingsMap = ratingsData.reduce(
        (acc, { menuId, rating }) => {
          if (rating > 0) {
            acc[menuId] = rating;
          }
          return acc;
        },
        {} as Record<number, number>
      );

      setRatings(ratingsMap);
    } catch (err) {
      console.error('Failed to fetch user ratings:', err);
    }
  };

  useEffect(() => {
    const fetchPopularMenus = async () => {
      try {
        setLoading(true);
        const data = await api.get<MenuItem[]>('/api/menu/popular?limit=10');
        setMenuItems(data);
      } catch (err) {
        console.error('Failed to fetch popular menus:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Separate useEffect for fetching ratings when accessToken becomes available
  useEffect(() => {
    if (accessToken && menuItems.length > 0) {
      fetchUserRatings(menuItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, menuItems.length]);

  const handleStarClick = (menuId: number, rating: number) => {
    if (!accessToken) {
      setShowAuthModal(true);
      return;
    }
    submitMenuRating(menuId, rating);
  };

  const handleCommentClick = () => {
    if (!accessToken) {
      setShowAuthModal(true);
      return;
    }
    // Continue with comment submission logic
  };

  const submitMenuRating = async (menuId: number, rating: number) => {
    try {
      // Submit the rating
      await api.post('/api/menuRatings', {
        menuId,
        rating,
      });

      // Immediately update local state
      setRatings((prev) => ({
        ...prev,
        [menuId]: rating,
      }));

      // Fetch updated menu data to get new average rating
      const updatedData = await api.get<{ averageRating: number }>(
        `/api/menuRatings?menuId=${menuId}`
      );

      // Update the menu item with new average rating
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === menuId
            ? {
                ...item,
                averageRating: updatedData.averageRating || item.averageRating,
              }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to submit rating:', err);
    }
  };

  return (
    <>
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

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
            {loading ? (
              // Show skeletons while loading
              <>
                {[...Array(3)].map((_, index) => (
                  <MenuItemSkeleton key={index} />
                ))}
              </>
            ) : (
              // Show actual menu items when loaded
              menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 border border-border"
                >
                  {/* Image Slider (Left Side) */}
                  <div className="relative">
                    <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Image Available
                        </div>
                      )}
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
                                : 'text-gray-300 dark:text-gray-600'
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
                    <p className="text-xl font-bold text-green-600 dark:text-green-400 mb-6">
                      {item.price}
                    </p>

                    {/* Rate Star Input */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-card-foreground mb-2">
                        Your Rating:
                      </h3>
                      <div className="flex text-3xl">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            onClick={() => handleStarClick(item.id, i + 1)}
                            className={`cursor-pointer transition-colors duration-200 hover:scale-110 ${
                              i < (ratings[item.id] || 0)
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                            }`}
                          />
                        ))}
                      </div>
                      {accessToken && ratings[item.id] && (
                        <p className="text-sm text-muted-foreground mt-1">
                          You rated this {ratings[item.id]} star
                          {ratings[item.id] !== 1 ? 's' : ''}
                        </p>
                      )}
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
                            className="bg-gray-50 dark:bg-slate-700/50 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-slate-600"
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
                                    className="bg-white dark:bg-slate-600/50 p-2 rounded-md text-sm border border-gray-100 dark:border-slate-500"
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
                          onClick={handleCommentClick}
                        ></textarea>

                        <button
                          onClick={handleCommentClick}
                          className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
