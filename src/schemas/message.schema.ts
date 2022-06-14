import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessagesDocument = Messages & Document;

@Schema()
export class Messages {
  @Prop({ required: true, type: String, ref: 'User' })
  userId: string;

  @Prop({ required: true, type: String, ref: 'Post' })
  postId: string;

  @Prop({ required: true, type: String })
  text: string;

  @Prop({ required: true, type: Date })
  createdAt: Date;
}

export const MessagesSchema = SchemaFactory.createForClass(Messages);
