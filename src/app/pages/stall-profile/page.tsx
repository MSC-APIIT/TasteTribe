'use client';

import { useState } from 'react';
import { MenuItemCard, MenuItem } from '@/components/ui/menu-item-card';
import { MenuForm } from '@/components/ui/menu-form';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { CommentCard, Comment } from '@/components/ui/comment-card';
import { StallForm } from '@/components/ui/stall-form';
import { Stall } from '@/components/ui/stall-card';

const StallProfilePage = () => {
  const [stall, setStall] = useState<Stall>({
    id: '1',
    name: 'My Awesome Stall',
    description: 'The best food in town!',
    coverImages: ['/logo.png'],
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Burger',
      description: 'A delicious beef burger',
      price: 10,
    },
    { id: '2', name: 'Fries', description: 'Crispy golden fries', price: 5 },
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Jane Doe',
      comment: 'The burger was amazing!',
      rating: 5,
    },
    {
      id: '2',
      author: 'John Smith',
      comment: 'The fries were a bit cold.',
      rating: 3,
    },
  ]);

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isStallModalOpen, setIsStallModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>(
    undefined
  );

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

  const handleStallUpdate = (updatedStall: Stall) => {
    setStall(updatedStall);
    setIsStallModalOpen(false);
  };

  return (
    <div style={{ paddingTop: '128px' }} className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Stall Profile</h1>
        <Button onClick={() => setIsStallModalOpen(true)}>Edit Stall</Button>
      </div>
      <div>
        <h2 className="text-xl font-semibold">{stall.name}</h2>
        <p>{stall.description}</p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stall.coverImages.map((image, index) => (
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

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <Button
          onClick={() => {
            setEditingItem(undefined);
            setIsMenuModalOpen(true);
          }}
          className="mt-4"
        >
          Add New Item
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Ratings & Comments</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      </div>

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
        <StallForm onSubmit={handleStallUpdate} initialData={stall} />
      </Modal>
    </div>
  );
};

export default StallProfilePage;
