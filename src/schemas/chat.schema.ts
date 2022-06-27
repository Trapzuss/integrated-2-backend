import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MessagesSchema } from './message.schema';

export type ChatsDocument = Chats & Document;

@Schema()
export class Chats {
  // @Prop({ _id: true, type: String })
  // chatId: string;

  @Prop({ type: Array })
  participants: Array<String>;

  @Prop({ type: String })
  adoptStatus: string;

  @Prop({ required: true, type: String, ref: 'Post' })
  postId: string;

  // Date().toLocaleString("th-TH", {
  //   timeZone: "Asia/Bangkok",
  // })

  @Prop({ default: Date.now(), type: Date })
  createdAt: Date;

  @Prop({ default: Date.now(), type: Date })
  updatedAt: Date;

  @Prop({ required: true, type: [MessagesSchema] })
  messages: Array<Object>;
}

export const ChatsSchema = SchemaFactory.createForClass(Chats);
