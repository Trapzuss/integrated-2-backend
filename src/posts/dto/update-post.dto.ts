import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  userId: string;
  petName: string;
  images: [];
  address: {};
  description: string;
  sex: string;
  age: number;
  weight: number;
  price: number;
}
