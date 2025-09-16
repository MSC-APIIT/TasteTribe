'use client';

import { useState } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Button } from './button';
import { Stall } from './stall-card';

export function StallForm({
  onSubmit,
  initialData,
}: {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (stall: Stall) => void;
  initialData?: Stall;
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );
  const [coverImages, setCoverImages] = useState<string[]>(
    initialData?.coverImages || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id || Date.now().toString(),
      name,
      description,
      coverImages,
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
            setCoverImages(newImages);
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="stallDescription">Description</Label>
        <Input
          id="stallDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="coverImages">Cover Images (up to 5)</Label>
        <Input
          type="file"
          id="coverImages"
          accept="image/*"
          multiple
          onChange={handleCoverImageChange}
          className="mt-1 block w-full"
        />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {coverImages.map((image, index) => (
            <div key={index} className="relative h-32 w-full">
              <img
                src={image}
                alt={`Cover image ${index + 1}`}
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
