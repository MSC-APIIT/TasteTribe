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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
