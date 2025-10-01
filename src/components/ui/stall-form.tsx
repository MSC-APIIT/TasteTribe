'use client';

import { useState } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Button } from './button';
import { Stall } from './stall-card';
import { useAuth } from '@/hooks/userAuth';
import toast from 'react-hot-toast';

export function StallForm({
  onSubmit,
  initialData,
}: {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (stall: Stall) => void;
  initialData?: Stall;
}) {
  const [stallName, setstallName] = useState(initialData?.stallName || '');
  const [stallDescription, setstallDescription] = useState(
    initialData?.stallDescription || ''
  );
  const [stallImage, setstallImage] = useState<string[]>(
    initialData?.stallImage || []
  );
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('User not authenticated');
      return;
    }
    onSubmit({
      profileId: user.id,
      stallName,
      stallDescription,
      stallImage,
    });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      const newImages: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push(event.target?.result as string);
          if (newImages.length === files.length) {
            setstallImage(newImages);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="stallName">Stall Name</Label>
        <Input
          id="stallName"
          value={stallName}
          onChange={(e) => setstallName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="stallDescription">Description</Label>
        <Input
          id="stallDescription"
          value={stallDescription}
          onChange={(e) => setstallDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="stallImage">Cover Images (up to 5)</Label>
        <Input
          type="file"
          id="stallImage"
          accept="image/*"
          multiple
          onChange={handleCoverImageChange}
          className="mt-1 block w-full"
        />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stallImage.map((image, index) => (
            <div key={index} className="relative h-32 w-full">
              <img
                src={image}
                alt={`stall image ${index + 1}`}
                className="h-full w-full object-cover rounded-md"
              />
            </div>
          ))}
        </div>
      </div>
      <Button type="submit">{initialData ? 'Update' : 'Create'} Stall</Button>
    </form>
  );
}
