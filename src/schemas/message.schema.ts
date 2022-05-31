import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessagesDocument = Messages & Document;

@Schema()
export class Messages {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  text: string;
}

export const MessagesSchema = SchemaFactory.createForClass(Messages);
