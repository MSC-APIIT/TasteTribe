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

export default function StallProfilePage({ stallId }: StallProfilePageProps) {
  const { accessToken } = useAuth();
  const api = useApi(accessToken ?? undefined);
  console.log('Access Token:', accessToken);

  const [stall, setStall] = useState<Stall | null>(null);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Gourmet Burger',
      description:
        'Premium beef patty with artisanal cheese, fresh vegetables, and house-made sauce',
      price: 15,
    },
    {
      id: '2',
      name: 'Truffle Fries',
      description: 'Hand-cut golden fries with truffle oil and parmesan cheese',
      price: 8,
    },
    {
      id: '3',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with homemade dressing and croutons',
      price: 12,
    },
    {
      id: '4',
      name: 'Grilled Chicken',
      description: 'Herb-marinated chicken breast with seasonal vegetables',
      price: 18,
    },
  ]);

  // eslint-disable-next-line no-unused-vars
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Sarah Johnson',
      comment:
        'Outstanding food quality and presentation. The truffle fries are absolutely divine!',
      rating: 5,
    },
    {
      id: '2',
      author: 'Michael Chen',
      comment:
        'Great atmosphere and friendly service. The burger exceeded my expectations.',
      rating: 4,
    },
    {
      id: '3',
      author: 'Emma Wilson',
      comment:
        'Fresh ingredients and authentic flavors. Will definitely return!',
      rating: 5,
    },
  ]);

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isStallModalOpen, setIsStallModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchStall = async () => {
      try {
        console.log('Fetching stall with ID:', stallId);
        const data = await api.get<Stall>(`/api/stall/${stallId}`);
        setStall(data);
      } catch (err) {
        console.error('Failed to fetch stall:', err);
      }
    };

    if (stallId) {
      console.log('Fetched stalls:', stall);
      fetchStall();
    }
  }, [accessToken, stallId, api]);

  const handleAddItem = (item: MenuItem) => {
    setMenuItems([...menuItems, item]);
    setIsMenuModalOpen(false);
  };

  const handleEditItem = (item: MenuItem) => {
    setMenuItems(menuItems.map((i) => (i.id === item.id ? item : i)));
    setIsMenuModalOpen(false);
    setEditingItem(undefined);
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter((i) => i.id !== id));
  };

  const handleStallUpdate = async (updatedStall: Stall) => {
    try {
      const response = await api.put<Stall>(`/api/stall/${stallId}`, updatedStall);
      setStall(response);
      setIsStallModalOpen(false);
      toast.success('Stall Updated successfully!');
    } catch (error) {
      console.error('Failed to update stall:', error);
    }
  };

  const averageRating =
    comments.reduce((acc, comment) => acc + comment.rating, 0) /
    comments.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-6xl mx-auto">
            {/* Stall Header */}
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
                    {/* Placeholder for additional images */}
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
                    >
                      Edit Profile
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6 pt-4 border-t border-border">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {menuItems.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Menu Items
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {comments.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Reviews
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {averageRating.toFixed(1)}★
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Average Rating
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
              <Button
                onClick={() => {
                  setEditingItem(undefined);
                  setIsMenuModalOpen(true);
                }}
                className="flex-shrink-0"
              >
                Add New Item
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onEdit={() => {
                    setEditingItem(item);
                    setIsMenuModalOpen(true);
                  }}
                  onDelete={() => handleDeleteItem(item.id)}
                />
              ))}
            </div>

            {menuItems.length === 0 && (
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
                What our customers are saying
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>

            {comments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground text-lg">
                  No reviews yet
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
