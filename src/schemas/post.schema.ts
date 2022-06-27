import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import AddressInterface from 'src/interfaces/address';
import { AddressSchema } from './address.schema';

export type PostsDocument = Posts & Document;

@Schema()
export class Posts {
  @Prop({ required: true, type: String, ref: 'User' })
  userId: string;

  @Prop({ required: true, type: String })
  petName: string;

  @Prop({ required: true, type: Array })
  images: string;

  @Prop({ required: true, type: AddressSchema })
  address: AddressInterface;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String })
  sex: string;

  @Prop({ type: Object })
  age: {
    year: string;
    month: string;
  };

  @Prop({ type: String })
  weight: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ default: null, type: String })
  adoptedBy: String;

  @Prop({ default: Date.now, type: Date })
  createdAt: Date;

  @Prop({ default: Date.now, type: Date })
  updatedAt: Date;

  @Prop({ default: null, type: Date })
  adoptedAt: Date;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
