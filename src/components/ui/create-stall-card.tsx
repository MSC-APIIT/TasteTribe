'use client';

import { Card, CardContent } from './card';

export function CreateStallCard({ onClick }: { onClick: () => void }) {
  return (
    <Card
      onClick={onClick}
      className="flex h-full cursor-pointer items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary"
    >
      <CardContent className="text-center">
        <div className="text-4xl text-gray-400">+</div>
        <div className="mt-2 text-sm font-medium text-gray-600">
          Create New Stall
        </div>
      </CardContent>
    </Card>
  );
}
