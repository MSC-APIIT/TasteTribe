export interface CommentDto {
  id: string;
  user: string;
  text: string;
  replies: CommentDto[];
  createdAt?: string;
}
