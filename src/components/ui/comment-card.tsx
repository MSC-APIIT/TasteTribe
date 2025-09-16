'use client';

import { Card, CardContent } from './card';
import { Rating } from './rating';

export interface Comment {
  id: string;
  author: string;
  comment: string;
  rating: number;
}

export function CommentCard({ comment }: { comment: Comment }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <div className="font-bold mr-2">{comment.author}</div>
          <Rating rating={comment.rating} />
        </div>
        <p>{comment.comment}</p>
      </CardContent>
    </Card>
  );
}
