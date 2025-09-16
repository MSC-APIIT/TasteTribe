'use client';

import { useState } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Button } from './button';
import { MenuItem } from './menu-item-card';

export function MenuForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (item: MenuItem) => void;
  initialData?: MenuItem;
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );
  const [price, setPrice] = useState(initialData?.price || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id || Date.now().toString(),
      name,
      description,
      price,
    });
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
      <Button type="submit">{initialData ? 'Update' : 'Add'} Item</Button>
    </form>
  );
}
