'use client';

import { useState, useRef } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Button } from './button';
import { MenuItem } from './menu-item-card';

export function MenuForm({
  onSubmit,
  initialData,
}: {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (item: MenuItem, files?: File[]) => void;
  initialData?: MenuItem;
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );

  const [price, setPrice] = useState(initialData?.price || 0);
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).slice(0, 5); // max 5
    const previews = files.map((file) => URL.createObjectURL(file));

    setImages(previews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const files = fileInputRef.current?.files
      ? Array.from(fileInputRef.current.files).slice(0, 5)
      : [];

    onSubmit(
      {
        id: initialData?._id || '',
        name,
        description,
        price,
        images,
      },
      files
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="itemName">Name</Label>
        <Input
          id="itemName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="itemDescription">Description</Label>
        <Input
          id="itemDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="itemPrice">Price</Label>
        <Input
          id="itemPrice"
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          required
        />
      </div>

      {/* Image Upload */}
      <div>
        <Label htmlFor="itemImages">Images (max 5)</Label>
        <Input
          id="itemImages"
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {images.map((src, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-md overflow-hidden"
              >
                <img
                  src={src}
                  alt={`preview-${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit">{initialData ? 'Update' : 'Add'} Item</Button>
    </form>
  );
}
