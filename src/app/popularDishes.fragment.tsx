/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
'use client';

import * as React from 'react';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/userAuth';

interface Comment {
  _id: string;
  menuId: string;
  userId: string;
  userName: string;
  text: string;
  parentId?: string;
  createdAt: string;
  replies?: Comment[];
}

interface MenuItem {
  id: number;
  name: string;
  images: string[];
  averageRating: number;
  description: string;
  price: string;
  stallName: string;
  stallOverallRating: number;
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

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

          <div className="space-y-3">
            <button
              onClick={() => {
                window.location.href = '/auth/signin';
              }}
              className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Sign In
            </button>

            <button
              onClick={() => {
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
      <div className="relative">
        <div className="w-full h-64 bg-muted rounded-lg"></div>
      </div>

      <div>
        <div className="flex justify-between items-start mb-2">
          <div className="h-8 bg-muted rounded w-2/3"></div>
          <div className="h-6 bg-muted rounded w-24"></div>
        </div>

        <div className="flex items-center mb-4">
          <div className="h-6 bg-muted rounded w-32 mr-2"></div>
          <div className="h-6 bg-muted rounded w-12"></div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>

        <div className="h-8 bg-muted rounded w-24 mb-6"></div>

        <div className="mb-6">
          <div className="h-6 bg-muted rounded w-32 mb-2"></div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-muted rounded"></div>
            ))}
          </div>
        </div>

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
        </div>
      </div>
    </div>
  );
}

// Comment Component with improved reply UI and expand/collapse
function CommentItem({
  comment,
  onReply,
  accessToken,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  onCancelReply,
  isReplying,
  submitting,
}: {
  comment: Comment;
  onReply: (commentId: string, userName: string) => void;
  accessToken: string | null;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
  isReplying: boolean;
  submitting: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(true); // Auto-expand if there are replies
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="space-y-3">
      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-100 dark:border-slate-600">
        <div className="flex items-start justify-between mb-2">
          <p className="font-semibold text-card-foreground">
            {comment.userName}
          </p>
          <p className="text-xs text-muted-foreground/70">
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
        <p className="text-muted-foreground text-sm mb-3">{comment.text}</p>

        <div className="flex items-center gap-3">
          {accessToken && (
            <button
              onClick={() => onReply(comment._id, comment.userName)}
              className="text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
              Reply
            </button>
          )}

          {hasReplies && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors"
            >
              {isExpanded ? (
                <>
                  <FiChevronUp className="w-3 h-3" />
                  Hide {comment.replies!.length}{' '}
                  {comment.replies!.length === 1 ? 'reply' : 'replies'}
                </>
              ) : (
                <>
                  <FiChevronDown className="w-3 h-3" />
                  Show {comment.replies!.length}{' '}
                  {comment.replies!.length === 1 ? 'reply' : 'replies'}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Reply Input - Shows directly under the comment being replied to */}
      {isReplying && (
        <div className="ml-6 bg-white dark:bg-slate-600/30 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">
              Replying to{' '}
              <span className="font-semibold">{comment.userName}</span>
            </p>
            <button
              onClick={onCancelReply}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
          <textarea
            className="w-full p-2 border border-border rounded-md bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-orange-500"
            rows={2}
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={onCancelReply}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmitReply}
              disabled={!replyText.trim() || submitting}
              className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Posting...' : 'Reply'}
            </button>
          </div>
        </div>
      )}

      {/* Replies - Collapsible */}
      {hasReplies && isExpanded && (
        <div className="ml-6 space-y-3">
          {comment.replies!.map((reply) => (
            <div
              key={reply._id}
              className="bg-white dark:bg-slate-600/50 p-3 rounded-md border border-gray-100 dark:border-slate-500"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-secondary-foreground text-sm">
                  {reply.userName}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {new Date(reply.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-muted-foreground text-sm">{reply.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PopularDishes() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<number, string>>({});
  const [replyingTo, setReplyingTo] = useState<{
    menuId: number;
    commentId: string;
    userName: string;
  } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [submittingComment, setSubmittingComment] = useState<
    Record<number, boolean>
  >({});

  const { accessToken } = useAuth();
  const api = useApi(accessToken ?? undefined);

  // Fetch comments for a single menu item
  const fetchCommentsForMenu = useCallback(
    async (menuId: number) => {
      try {
        const data = await api.get<Comment[]>(
          `/api/menuComments?menuId=${menuId}`
        );

        // API already returns comments with nested replies, so just use it directly
        setComments((prev) => ({
          ...prev,
          [menuId]: data,
        }));
      } catch (err) {
        console.error(`Failed to fetch comments for menu ${menuId}:`, err);
        setComments((prev) => ({
          ...prev,
          [menuId]: [],
        }));
      }
    },
    [api]
  );

  // Fetch comments for all menu items
  const fetchAllComments = useCallback(
    async (items: MenuItem[]) => {
      await Promise.all(items.map((item) => fetchCommentsForMenu(item.id)));
    },
    [fetchCommentsForMenu]
  );

  // Fetch user's ratings for all menu items
  const fetchUserRatings = useCallback(
    async (items: MenuItem[]) => {
      if (!accessToken) return;

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
    },
    [accessToken, api]
  );

  // Initial data fetch
  useEffect(() => {
    const fetchPopularMenus = async () => {
      try {
        setLoading(true);
        const data = await api.get<MenuItem[]>('/api/menu/popular?limit=10');
        setMenuItems(data);
        await fetchAllComments(data);
      } catch (err) {
        console.error('Failed to fetch popular menus:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMenus();
  }, [api, fetchAllComments]);

  // Fetch user ratings when accessToken changes
  useEffect(() => {
    if (accessToken && menuItems.length > 0) {
      fetchUserRatings(menuItems);
    }
  }, [accessToken, menuItems.length]);

  const handleStarClick = (menuId: number, rating: number) => {
    if (!accessToken) {
      setShowAuthModal(true);
      return;
    }
    submitMenuRating(menuId, rating);
  };

  const submitMenuRating = async (menuId: number, rating: number) => {
    try {
      await api.post('/api/menuRatings', {
        menuId,
        rating,
      });

      setRatings((prev) => ({
        ...prev,
        [menuId]: rating,
      }));

      const updatedData = await api.get<{ averageRating: number }>(
        `/api/menuRatings?menuId=${menuId}`
      );

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

  const handlePostComment = async (menuId: number) => {
    if (!accessToken) {
      setShowAuthModal(true);
      return;
    }

    const text = newComment[menuId]?.trim();
    if (!text) return;

    setSubmittingComment((prev) => ({ ...prev, [menuId]: true }));

    try {
      await api.post('/api/menuComments', {
        menuId: menuId.toString(),
        text,
      });

      setNewComment((prev) => ({ ...prev, [menuId]: '' }));
      await fetchCommentsForMenu(menuId);
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [menuId]: false }));
    }
  };

  const handleReply = (menuId: number, commentId: string, userName: string) => {
    if (!accessToken) {
      setShowAuthModal(true);
      return;
    }
    setReplyingTo({ menuId, commentId, userName });
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handleSubmitReply = async () => {
    if (!replyingTo || !replyText.trim()) return;

    setSubmittingComment((prev) => ({ ...prev, [replyingTo.menuId]: true }));

    try {
      await api.post('/api/menuComments', {
        menuId: replyingTo.menuId.toString(),
        text: replyText,
        parentId: replyingTo.commentId,
      });

      setReplyingTo(null);
      setReplyText('');
      await fetchCommentsForMenu(replyingTo.menuId);
    } catch (err) {
      console.error('Failed to post reply:', err);
      alert('Failed to post reply. Please try again.');
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [replyingTo.menuId]: false }));
    }
  };

  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

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

          <div className="space-y-8">
            {loading ? (
              <>
                {[...Array(3)].map((_, index) => (
                  <MenuItemSkeleton key={index} />
                ))}
              </>
            ) : (
              menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 border border-border"
                >
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
                  </div>

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

                    <div className="border-t border-border pt-4">
                      <h3 className="text-lg font-medium text-card-foreground mb-4">
                        Comments ({comments[item.id]?.length || 0})
                      </h3>
                      <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {comments[item.id]?.map((comment) => (
                          <CommentItem
                            key={comment._id}
                            comment={comment}
                            onReply={(commentId, userName) =>
                              handleReply(item.id, commentId, userName)
                            }
                            accessToken={accessToken}
                            replyText={replyText}
                            onReplyTextChange={setReplyText}
                            onSubmitReply={handleSubmitReply}
                            onCancelReply={handleCancelReply}
                            isReplying={
                              replyingTo?.menuId === item.id &&
                              replyingTo?.commentId === comment._id
                            }
                            submitting={submittingComment[item.id] || false}
                          />
                        ))}
                        {(!comments[item.id] ||
                          comments[item.id].length === 0) && (
                          <p className="text-muted-foreground text-sm">
                            No comments yet. Be the first to comment!
                          </p>
                        )}
                      </div>

                      <div className="mt-4">
                        <textarea
                          className="w-full p-3 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows={3}
                          placeholder="Add your comment..."
                          value={newComment[item.id] || ''}
                          onChange={(e) =>
                            setNewComment((prev) => ({
                              ...prev,
                              [item.id]: e.target.value,
                            }))
                          }
                          onClick={() => {
                            if (!accessToken) setShowAuthModal(true);
                          }}
                        />

                        <button
                          onClick={() => handlePostComment(item.id)}
                          disabled={
                            !newComment[item.id]?.trim() ||
                            submittingComment[item.id]
                          }
                          className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submittingComment[item.id]
                            ? 'Posting...'
                            : 'Post Comment'}
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
