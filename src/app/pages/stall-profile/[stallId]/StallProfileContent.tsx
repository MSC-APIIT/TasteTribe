'use client';

import { useEffect, useState } from 'react';
import { MenuItemCard, MenuItem } from '@/components/ui/menu-item-card';
import { MenuForm } from '@/components/ui/menu-form';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { CommentCard, Comment } from '@/components/ui/comment-card';
import { StallForm } from '@/components/ui/stall-form';
import { Stall } from '@/components/ui/stall-card';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/userAuth';
import toast from 'react-hot-toast';

interface StallProfilePageProps {
  stallId: string;
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
  ratingCount: number;
}

// Skeleton components
const StallHeaderSkeleton = () => (
  <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-8 shadow-lg animate-pulse">
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-shrink-0">
        <div className="grid grid-cols-2 gap-3 w-full lg:w-80">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg bg-gray-200/50 dark:bg-gray-800/50"
            />
          ))}
        </div>
      </div>
      <div className="flex-grow space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="w-full">
            <div className="h-10 bg-gray-200/50 dark:bg-gray-800/50 rounded-lg mb-2 w-2/3" />
            <div className="h-6 bg-gray-200/50 dark:bg-gray-800/50 rounded mb-2 w-full" />
            <div className="h-6 bg-gray-200/50 dark:bg-gray-800/50 rounded w-3/4" />
          </div>
          <div className="h-10 w-28 bg-gray-200/50 dark:bg-gray-800/50 rounded flex-shrink-0" />
        </div>
        <div className="flex flex-wrap gap-6 pt-4 border-t border-border">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="text-center">
              <div className="h-8 w-12 bg-gray-200/50 dark:bg-gray-800/50 rounded mb-1" />
              <div className="h-4 w-16 bg-gray-200/50 dark:bg-gray-800/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MenuItemSkeleton = () => (
  <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
    <div className="h-6 bg-gray-200/50 dark:bg-gray-800/50 rounded mb-3" />
    <div className="h-4 bg-gray-200/50 dark:bg-gray-800/50 rounded mb-2" />
    <div className="h-4 bg-gray-200/50 dark:bg-gray-800/50 rounded w-3/4 mb-4" />
    <div className="h-8 bg-gray-200/50 dark:bg-gray-800/50 rounded" />
  </div>
);

const CommentSkeleton = () => (
  <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-12 h-12 bg-gray-200/50 dark:bg-gray-800/50 rounded-full" />
      <div className="flex-1">
        <div className="h-5 bg-gray-200/50 dark:bg-gray-800/50 rounded w-1/4 mb-2" />
        <div className="h-4 bg-gray-200/50 dark:bg-gray-800/50 rounded w-1/3" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200/50 dark:bg-gray-800/50 rounded w-full" />
      <div className="h-4 bg-gray-200/50 dark:bg-gray-800/50 rounded w-5/6" />
    </div>
  </div>
);

export default function StallProfilePage({ stallId }: StallProfilePageProps) {
  const { accessToken } = useAuth();
  const api = useApi(accessToken ?? undefined);

  const [stall, setStall] = useState<Stall | null>(null);
  const [isLoadingStall, setIsLoadingStall] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [stallRatings, setStallRatings] = useState<{
    averageRating: number;
    totalReviews: number;
  }>({ averageRating: 0, totalReviews: 0 });

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isStallModalOpen, setIsStallModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>(
    undefined
  );

  // Fetch stall data
  useEffect(() => {
    const fetchStall = async () => {
      if (!accessToken || !stallId) return;

      try {
        setIsLoadingStall(true);
        const data = await api.get<Stall>(`/api/stall/${stallId}`);
        setStall(data);
      } catch (err) {
        console.error('Failed to fetch stall:', err);
        toast.error('Failed to load stall information');
      } finally {
        setIsLoadingStall(false);
      }
    };

    fetchStall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, stallId]);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!accessToken || !stallId) {
        return;
      }

      try {
        setIsLoadingMenu(true);
        const data = await api.get<MenuItem[]>(`/api/menu?stallId=${stallId}`);
        setMenuItems(data);
      } catch (err) {
        console.error('Failed to fetch menu items:', err);
        toast.error('Failed to load menu items');
        setMenuItems([]);
      } finally {
        setIsLoadingMenu(false);
      }
    };

    fetchMenuItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, stallId]);

  // Fetch comments and ratings for all menu items
  useEffect(() => {
    const fetchCommentsAndRatings = async () => {
      if (!menuItems.length) {
        setIsLoadingComments(false);
        return;
      }

      try {
        setIsLoadingComments(true);

        const commentsPromises = menuItems.map((item) => {
          const menuId = item._id || item.id;
          return api
            .get<ApiComment[]>(`/api/menuComments?menuId=${menuId}`)
            .catch((err) => {
              console.error(
                `Failed to fetch comments for menu ${menuId}:`,
                err
              );
              return [] as ApiComment[];
            });
        });

        const ratingsPromises = menuItems.map((item) => {
          const menuId = item._id || item.id;
          return api
            .get<MenuRating>(`/api/menuRatings?menuId=${menuId}`)
            .catch((err) => {
              console.error(`Failed to fetch ratings for menu ${menuId}:`, err);
              return {
                averageRating: 0,
                ratingCount: 0,
                userRating: 0,
              };
            });
        });

        const [commentsResults, ratingsResults] = await Promise.all([
          Promise.all(commentsPromises),
          Promise.all(ratingsPromises),
        ]);

        // Transform API comments to UI format
        const allComments: Comment[] = [];
        commentsResults.forEach((menuComments, index) => {
          const topLevelComments = menuComments.filter((c) => !c.parentId);

          topLevelComments.forEach((apiComment) => {
            allComments.push({
              id: apiComment._id,
              author: apiComment.userName,
              comment: apiComment.text,
              rating: ratingsResults[index]?.averageRating || 0,
            });
          });
        });

        setComments(allComments);

        // Calculate stall-wide ratings using correct property names
        const totalRatings = ratingsResults.reduce(
          (sum, rating) => sum + (rating?.ratingCount || 0),
          0
        );
        const weightedSum = ratingsResults.reduce(
          (sum, rating) =>
            sum + (rating?.averageRating || 0) * (rating?.ratingCount || 0),
          0
        );
        const averageRating = totalRatings > 0 ? weightedSum / totalRatings : 0;

        setStallRatings({
          averageRating,
          totalReviews: totalRatings,
        });
      } catch (err) {
        console.error('Failed to fetch comments and ratings:', err);
        toast.error('Failed to load reviews');
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchCommentsAndRatings();
  }, [menuItems, api]);

  const handleAddItem = async (item: MenuItem, images?: File[]) => {
    try {
      const formData = new FormData();
      formData.append('stallId', stallId);
      formData.append('name', item.name);
      formData.append('description', item.description);
      formData.append('price', item.price.toString());

      if (images?.length) {
        images.forEach((img) => formData.append('images', img));
      }

      const newItem = await api.post<MenuItem>('/api/menu', formData);
      setMenuItems((prevItems) => [...prevItems, newItem]);
      setIsMenuModalOpen(false);
      toast.success('Menu item added successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to add menu item');
    }
  };

  const handleEditItem = async (item: MenuItem, images?: File[]) => {
    try {
      const formData = new FormData();
      formData.append('menuId', item.id);
      formData.append('stallId', stallId);
      formData.append('name', item.name);
      formData.append('description', item.description);
      formData.append('price', item.price.toString());

      if (images?.length) {
        images.forEach((img) => formData.append('images', img));
      }

      const updatedItem = await api.put<MenuItem>('/api/menu', formData);
      setMenuItems((prevItems) =>
        prevItems.map((i) => {
          const currentItemId = i._id || i.id;
          const targetItemId = item._id || item.id;
          return currentItemId === targetItemId ? updatedItem : i;
        })
      );
      setIsMenuModalOpen(false);
      setEditingItem(undefined);
      toast.success('Menu item updated successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update menu item');
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await api.get<MenuItem[]>(
        '/api/menu?stallId=' + stallId
      );
      setMenuItems(response);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to fetch menu items');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await api.delete(`/api/menu?menuId=${id}`);
      await fetchMenuItems();
      toast.success('Menu item deleted successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to delete menu item');
    }
  };

  const handleStallUpdate = async (updatedStall: Stall) => {
    try {
      const response = await api.put<Stall>(
        `/api/stall/${stallId}`,
        updatedStall
      );
      setStall(response);
      setIsStallModalOpen(false);
      toast.success('Stall updated successfully!');
    } catch (error: any) {
      console.error('Failed to update stall:', error);
      toast.error(error.message || 'Failed to update stall');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-6xl mx-auto">
            {/* Stall Header */}
            {isLoadingStall ? (
              <StallHeaderSkeleton />
            ) : (
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-8 shadow-lg">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Cover Images */}
                  <div className="flex-shrink-0">
                    <div className="grid grid-cols-2 gap-3 w-full lg:w-80">
                      {stall?.stallImage?.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden shadow-md"
                        >
                          <img
                            src={image}
                            alt={`${stall?.stallName} - Image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      ))}
                      {stall?.stallImage &&
                        Array.from({
                          length: Math.max(0, 4 - stall.stallImage.length),
                        }).map((_, index) => (
                          <div
                            key={`placeholder-${index}`}
                            className="aspect-square rounded-lg bg-muted border border-dashed border-muted-foreground/30 flex items-center justify-center"
                          >
                            <span className="text-muted-foreground text-sm">
                              Add Image
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Stall Info */}
                  <div className="flex-grow space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">
                          {stall?.stallName}
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                          {stall?.stallDescription}
                        </p>
                      </div>
                      <Button
                        onClick={() => setIsStallModalOpen(true)}
                        variant="outline"
                        className="flex-shrink-0"
                        disabled={!stall}
                      >
                        Edit Profile
                      </Button>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 pt-4 border-t border-border">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {isLoadingMenu ? (
                            <div className="h-8 w-8 bg-gray-200/50 dark:bg-gray-800/50 rounded animate-pulse" />
                          ) : (
                            menuItems.length
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Menu Items
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {isLoadingComments ? (
                            <div className="h-8 w-8 bg-gray-200/50 dark:bg-gray-800/50 rounded animate-pulse" />
                          ) : (
                            stallRatings.totalReviews
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Reviews
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {isLoadingComments ? (
                            <div className="h-8 w-8 bg-gray-200/50 dark:bg-gray-800/50 rounded animate-pulse" />
                          ) : (
                            `${stallRatings.averageRating.toFixed(1)} ★`
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Average Rating
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Menu Section */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Menu Details
                </h2>
                <p className="text-muted-foreground mt-1">
                  Discover our carefully crafted dishes
                </p>
              </div>
            </div>

            {isLoadingMenu ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <MenuItemSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onEdit={() => {
                      setEditingItem(item);
                      setIsMenuModalOpen(true);
                    }}
                    onDelete={() => handleDeleteItem(item._id!)}
                  />
                ))}
                <div
                  onClick={() => {
                    if (isLoadingStall || !accessToken) return;
                    setEditingItem(undefined);
                    setIsMenuModalOpen(true);
                  }}
                  className={`bg-card border border-dashed border-muted-foreground/30 rounded-lg p-6 cursor-pointer transition-colors hover:bg-muted/50 hover:border-primary/50 flex items-center justify-center min-h-[200px] ${
                    isLoadingStall || !accessToken
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 mx-auto">
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <p className="text-muted-foreground font-medium">
                      Add New Item
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isLoadingMenu && menuItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground text-lg mb-4">
                  No menu items yet
                </div>
                <Button
                  onClick={() => {
                    setEditingItem(undefined);
                    setIsMenuModalOpen(true);
                  }}
                  variant="outline"
                >
                  Add Your First Item
                </Button>
              </div>
            )}
          </section>

          {/* Reviews Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Customer Reviews
              </h2>
              <p className="text-muted-foreground mt-1">
                What our customers are saying about all our dishes
              </p>
            </div>

            {isLoadingComments ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <CommentSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))}
              </div>
            )}

            {!isLoadingComments && comments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground text-lg">
                  No reviews yet!
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)}>
        <MenuForm
          onSubmit={editingItem ? handleEditItem : handleAddItem}
          initialData={editingItem}
        />
      </Modal>

      <Modal
        isOpen={isStallModalOpen}
        onClose={() => setIsStallModalOpen(false)}
      >
        <StallForm
          onSubmit={handleStallUpdate}
          initialData={stall ?? undefined}
        />
      </Modal>
    </div>
  );
}
