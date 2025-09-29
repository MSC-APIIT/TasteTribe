import { useState } from 'react';
import Link from 'next/link';
import { Modal } from '@/components/ui/modal'; // assuming you already have one

export interface MenuItem {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
}

export function MenuItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Link href={`/pages/menu/${item._id}`}>
        <div className="bg-card rounded-lg shadow p-4 flex flex-col cursor-pointer hover:shadow-lg transition">
          {item.images && item.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {item.images.slice(0, 3).map((src, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-md overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`${item.name} - image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {item.description}
          </p>
          <div className="mt-2 flex justify-between items-center">
            <span className="font-bold text-primary">${item.price}</span>
            <div className="space-x-2">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit();
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setConfirmOpen(true);
                  }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>

      {confirmOpen && (
        <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">
              Delete `{item.name}`?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete this menu item? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-700"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white"
                onClick={() => {
                  if (onDelete) onDelete();
                  setConfirmOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
