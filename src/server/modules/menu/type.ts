import { CommentDto } from '../menuComments/type';

export interface MenuItemDto {
  stallId: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
}

export interface PopularMenuItem {
  id: string;
  name: string;
  images: string[];
  averageRating: number;
  ratingCount: number;
  description?: string;
  price: string;
  stallName: string;
  stallOverallRating: number;
  comments: CommentDto[];
}
