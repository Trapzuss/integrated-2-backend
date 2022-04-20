import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostsDocument = Posts & Document;

@Schema()
export class Posts {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: 0 })
  favoriteAmount: number;

  @Prop({ default: Date.now })
  create_at: number;

  @Prop({ required: true })
  userId: string;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
