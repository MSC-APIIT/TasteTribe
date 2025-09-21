'use client';

import { ReactNode } from 'react';

export function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white dark:bg-background border-2 border-gray-200 dark:border-border p-8 rounded-lg relative shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl text-muted-foreground hover:text-foreground transition-colors duration-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
        >
          &times;
        </button>
        <div className="text-foreground">{children}</div>
      </div>
    </div>
  );
}
