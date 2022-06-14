import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import AddressInterface from 'src/interfaces/address';
import { Address } from './address.schema';

export type PostsDocument = Posts & Document;

@Schema()
export class Posts {
  @Prop({ required: true, type: String, ref: 'User' })
  userId: string;

  @Prop({ required: true, type: String })
  petName: string;

  @Prop({ required: true, type: Array })
  images: string;

  @Prop({ required: true, type: Object })
  address: Address;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String })
  sex: string;

  @Prop({ required: true, type: Number })
  age: number;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ default: Date.now, type: Date })
  createdAt: Date;

  @Prop({ default: Date.now, type: Date })
  adoptedAt: Date;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
