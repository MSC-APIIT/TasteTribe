'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/userAuth';
import { Star, DollarSign, MessageSquare } from 'lucide-react';

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
  const { accessToken } = useAuth();
  const api = useApi(accessToken ?? undefined);

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageOrientations, setImageOrientations] = useState<
    ('portrait' | 'landscape')[]
  >([]);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        const data = await api.get<MenuItem>(`/api/menu/${menuIdStr}`);
        setMenuItem(data);

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuIdStr]);

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
            The item you`&apos;`re looking for doesn`&apos;`t exist.
          </p>
        </div>
      </div>
    );
  }

  const renderImages = () => {
    if (!menuItem.images || menuItem.images.length === 0) return null;

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
                {menuItem.rating?.toFixed(1) || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-5 h-5" />
              <span>{menuItem.comments?.length || 0} reviews</span>
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
                <DollarSign className="w-6 h-6" />
                <span className="text-4xl font-bold">{menuItem.price}</span>
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
          {menuItem.comments && menuItem.comments.length > 0 ? (
            <div className="space-y-4">
              {menuItem.comments.map((c) => (
                <div
                  key={c.id}
                  className="border-l-4 border-primary bg-muted/50 p-4 rounded-r-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-foreground">
                      {c.author}
                    </span>
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No reviews yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
