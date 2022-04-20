import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  favoriteAmount: number;
  userId?: string;
}
