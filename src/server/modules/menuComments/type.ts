export interface CommentDto {
  id: string;
  user: string; // display name (fallback to userId)
  text: string;
  replies: CommentDto[];
}
