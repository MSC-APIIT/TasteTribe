'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';
import { Stall } from '../../app/types/stall';

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
      data-testid="stall-card"
    >
      <CardHeader>
        <CardTitle>{stall.stallName}</CardTitle>
        <CardDescription>{stall.stallDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 w-full">
          <img
            src={stall.stallImage?.[0] || '/logo.png'}
            alt={stall.stallName}
            className="h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}
export type { Stall };