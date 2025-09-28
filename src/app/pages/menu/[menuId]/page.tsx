'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
  rating?: number;
  comments?: { id: string; author: string; comment: string; rating: number }[];
}

export default function MenuDetailPage() {
  const { menuId } = useParams();
  const menuIdStr = Array.isArray(menuId) ? menuId[0] : menuId;

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);

  // Dummy data fetch simulation
  useEffect(() => {
    const fetchMenuItem = async () => {
      // simulate API fetch
      const dummyData: MenuItem = {
        id: menuIdStr || '1',
        name: 'Gourmet Burger',
        description:
          'Premium beef patty with artisanal cheese, fresh vegetables, and house-made sauce',
        price: 15,
        images: [
          'https://via.placeholder.com/400x400?text=Burger+1',
          'https://via.placeholder.com/400x400?text=Burger+2',
          'https://via.placeholder.com/400x400?text=Burger+3',
        ],
        rating: 4.5,
        comments: [
          {
            id: '1',
            author: 'Sarah Johnson',
            comment: 'Amazing taste, very fresh ingredients!',
            rating: 5,
          },
          {
            id: '2',
            author: 'Michael Chen',
            comment: 'Good, but could use more sauce.',
            rating: 4,
          },
        ],
      };
      setMenuItem(dummyData);
    };
    fetchMenuItem();
  }, [menuId, menuIdStr]);

  if (!menuItem) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading menu details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Title + Price */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-4xl font-bold">{menuItem.name}</h1>
          <span className="text-2xl font-bold text-primary">
            ${menuItem.price}
          </span>
        </div>

        {/* Full Image Gallery */}
        {menuItem.images && menuItem.images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItem.images.map((src, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={src}
                  alt={`${menuItem.name} - image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-lg text-muted-foreground leading-relaxed">
          {menuItem.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary">
            Average Rating: {menuItem.rating}★
          </span>
        </div>

        {/* Comments */}
        <div className="space-y-4 border-t border-border pt-6">
          <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
          {menuItem.comments && menuItem.comments.length > 0 ? (
            menuItem.comments.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-card rounded-lg shadow-sm flex flex-col gap-1"
              >
                <div className="font-semibold">{c.author}</div>
                <div className="text-muted-foreground">{c.comment}</div>
                <div className="text-sm text-yellow-500">
                  Rating: {c.rating}★
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
