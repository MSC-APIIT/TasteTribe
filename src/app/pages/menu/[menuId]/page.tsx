'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/userAuth';
import { Star, MessageSquare, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface MenuItem {
  _id?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
  averageRating?: number;
}

interface ApiComment {
  _id: string;
  menuId: string;
  userId: string;
  userName: string;
  text: string;
  parentId?: string;
  createdAt: string;
  replies?: ApiComment[];
}

interface MenuRating {
  userRating?: number;
  averageRating: number;
  totalRatings: number;
}

interface CommentWithRating {
  id: string;
  author: string;
  comment: string;
  rating: number;
  createdAt: string;
  replies?: ApiComment[];
}

export default function MenuDetailPage() {
  const { menuId } = useParams();
  const menuIdStr = Array.isArray(menuId) ? menuId[0] : menuId;
  const { accessToken } = useAuth();
  const api = useApi(accessToken ?? undefined);

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [comments, setComments] = useState<CommentWithRating[]>([]);
  const [ratingData, setRatingData] = useState<MenuRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [imageOrientations, setImageOrientations] = useState<
    ('portrait' | 'landscape')[]
  >([]);

  // Fetch menu item details
  useEffect(() => {
    const fetchMenuItem = async () => {
      if (!menuIdStr) return;

      try {
        setLoading(true);
        const data = await api.get<MenuItem>(`/api/menu/${menuIdStr}`);
        setMenuItem(data);

        // Determine image orientations
        if (data.images) {
          const orientations = await Promise.all(
            data.images.map((src) => {
              return new Promise<'portrait' | 'landscape'>((resolve) => {
                const img = new Image();
                img.onload = () => {
                  resolve(img.height > img.width ? 'portrait' : 'landscape');
                };
                img.onerror = () => resolve('landscape');
                img.src = src;
              });
            })
          );
          setImageOrientations(orientations);
        }
      } catch (err) {
        console.error('Failed to fetch menu item:', err);
        toast.error('Failed to load menu item');
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItem();
  }, [api, menuIdStr]);

  // Fetch comments and ratings
  useEffect(() => {
    const fetchCommentsAndRatings = async () => {
      if (!menuIdStr) return;

      try {
        setLoadingComments(true);

        // Fetch comments
        const commentsData = await api.get<ApiComment[]>(
          `/api/menuComments?menuId=${menuIdStr}`
        );

        // Fetch ratings
        const ratingsData = await api.get<MenuRating>(
          `/api/menuRatings?menuId=${menuIdStr}`
        );

        setRatingData(ratingsData);

        // Filter top-level comments and organize replies
        const topLevelComments = commentsData.filter((c) => !c.parentId);

        // Fetch individual user ratings for each commenter
        const commentsWithRatings = await Promise.all(
          topLevelComments.map(async (comment) => {
            // Try to get the user's rating for this menu item
            let userRating = 0;
            try {
              // This would require a way to get a specific user's rating
              // For now, we'll use the average rating as fallback
              userRating = ratingsData.averageRating || 0;
            } catch (err) {
              console.error('Failed to fetch user rating:', err);
            }

            return {
              id: comment._id,
              author: comment.userName,
              comment: comment.text,
              rating: Math.round(userRating), // Round to nearest star
              createdAt: comment.createdAt,
              replies: commentsData.filter((c) => c.parentId === comment._id),
            };
          })
        );

        // Sort by most recent
        commentsWithRatings.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setComments(commentsWithRatings);
      } catch (err) {
        console.error('Failed to fetch comments and ratings:', err);
        toast.error('Failed to load reviews');
      } finally {
        setLoadingComments(false);
      }
    };

    fetchCommentsAndRatings();
  }, [api, menuIdStr]);

  const renderImages = () => {
    if (!menuItem?.images || menuItem.images.length === 0) {
      return (
        <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">No images available</p>
        </div>
      );
    }

    const rows: JSX.Element[] = [];
    let i = 0;

    while (i < menuItem.images.length) {
      const currentOrientation = imageOrientations[i] || 'landscape';

      if (currentOrientation === 'landscape') {
        rows.push(
          <div key={i} className="w-full">
            <img
              src={menuItem.images[i]}
              alt={`${menuItem.name} - image ${i + 1}`}
              className="w-full h-96 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
            />
          </div>
        );
        i++;
      } else {
        const nextOrientation = imageOrientations[i + 1];
        if (i + 1 < menuItem.images.length && nextOrientation === 'portrait') {
          rows.push(
            <div key={i} className="grid grid-cols-2 gap-4">
              <img
                src={menuItem.images[i]}
                alt={`${menuItem.name} - image ${i + 1}`}
                className="w-full h-96 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
              />
              <img
                src={menuItem.images[i + 1]}
                alt={`${menuItem.name} - image ${i + 2}`}
                className="w-full h-96 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
              />
            </div>
          );
          i += 2;
        } else {
          rows.push(
            <div key={i} className="w-full">
              <img
                src={menuItem.images[i]}
                alt={`${menuItem.name} - image ${i + 1}`}
                className="w-full h-96 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
              />
            </div>
          );
          i++;
        }
      }
    }

    return <div className="space-y-4">{rows}</div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-2/3 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aspect-video bg-muted rounded-lg"></div>
              <div className="aspect-video bg-muted rounded-lg"></div>
            </div>
            <div className="bg-card border border-border p-6 rounded-lg space-y-3">
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-5/6 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Menu item not found
          </h2>
          <p className="text-muted-foreground mt-2">
            The item you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 mt-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            {menuItem.name}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span className="font-semibold">
                {loadingComments ? (
                  <span className="inline-block w-12 h-5 bg-muted rounded animate-pulse"></span>
                ) : (
                  ratingData?.averageRating?.toFixed(1) || 'N/A'
                )}
              </span>
              {ratingData && ratingData.totalRatings > 0 && (
                <span className="text-sm">
                  ({ratingData.totalRatings}{' '}
                  {ratingData.totalRatings === 1 ? 'rating' : 'ratings'})
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-5 h-5" />
              <span>
                {loadingComments ? (
                  <span className="inline-block w-12 h-5 bg-muted rounded animate-pulse"></span>
                ) : (
                  `${comments.length} ${comments.length === 1 ? 'review' : 'reviews'}`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Images */}
        {renderImages()}

        {/* Details Card */}
        <div className="mt-8 bg-card border border-border rounded-lg shadow-md p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Description
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {menuItem.description}
              </p>
            </div>
            <div className="bg-primary text-primary-foreground px-8 py-6 rounded-lg text-center md:min-w-[200px]">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold">
                  {'LKR' + menuItem.price}
                </span>
              </div>
              <p className="text-sm opacity-90">Price</p>
            </div>
          </div>
        </div>

        {/* Reviews Card */}
        <div className="mt-6 bg-card border border-border rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Customer Reviews
          </h2>

          {loadingComments ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="border-l-4 border-muted bg-muted/50 p-4 rounded-r-lg animate-pulse"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-5 w-32 bg-muted rounded"></div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="w-4 h-4 bg-muted rounded"></div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-4 w-4/5 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="border-l-4 border-primary bg-muted/50 p-4 rounded-r-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">
                          {c.author}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {new Date(c.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < c.rating
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{c.comment}</p>

                  {/* Show replies if any */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="ml-8 mt-3 space-y-2">
                      {c.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="bg-background/50 border border-border rounded-lg p-3"
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-3 h-3 text-secondary" />
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-sm text-foreground">
                                {reply.userName}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground ml-8">
                            {reply.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No reviews yet!</p>
              <p className="text-sm mt-2">
                Be the first to share your thoughts about this dish.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
