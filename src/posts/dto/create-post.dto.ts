import internal from "stream";

export class CreatePostDto {
  userId: string;
  petName: string;
  images: [];
  address: {};
  description: string;
  sex: string;
  age: number;
  weight: number;
  price: number;
  createdAt: Date;
  adoptedAt: Date;
}
