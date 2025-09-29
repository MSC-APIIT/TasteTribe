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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const files = fileInputRef.current?.files
      ? Array.from(fileInputRef.current.files).slice(0, 5)
      : [];

    try {
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
    } finally {
      setLoading(false);
    }
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

      <Button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2"
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        )}
        {loading ? 'Saving...' : initialData ? 'Update Item' : 'Add Item'}
      </Button>
    </form>
  );
}
