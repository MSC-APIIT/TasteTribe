'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';

export interface Stall {
  id: string;
  name: string;
  description: string;
  coverImages: string[];
}

export function StallCard({
  stall,
  onClick,
}: {
  stall: Stall;
  onClick?: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition-shadow"
    >
      <CardHeader>
        <CardTitle>{stall.name}</CardTitle>
        <CardDescription>{stall.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 w-full">
          <img
            src={stall.coverImages[0] || '/logo.png'}
            alt={stall.name}
            className="h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}
