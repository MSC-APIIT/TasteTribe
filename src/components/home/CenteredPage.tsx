'use client';

import React, { ReactNode } from 'react';

interface CenteredPageProps {
  title: string;
  children?: ReactNode;
}

export default function CenteredPage({ title, children }: CenteredPageProps) {
  return (
    <div className="min-h-screen backdrop-blur-md flex justify-center">
      <div className="w-full max-w-4xl p-6 border border-gray-10-dark rounded-md shadow-lg bg-opacity-50 dark:bg-opacity-70 bg-white dark:bg-gray-800">
        <h1 className="text-xl font-semibold mb-4">{title}</h1>
        <div>{children}</div>
      </div>
    </div>
  );
}
