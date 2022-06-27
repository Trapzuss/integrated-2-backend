import internal from 'stream';

export class CreatePostDto {
  userId: string;
  petName: string;
  images: [];
  address: {};
  description: string;
  sex: string;
  age: {
    year: string;
    month: string;
  };
  weight: string;
  price: number;
  createdAt: Date;
  adoptedAt: Date;
}
