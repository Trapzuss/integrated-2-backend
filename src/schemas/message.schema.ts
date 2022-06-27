import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessagesDocument = Messages & Document;

@Schema()
export class Messages {
  //   @Prop({ _id: true })
  //   messageId: string;

  @Prop({ required: true, type: String, ref: 'User' })
  userId: string;

  @Prop({ required: true, type: String })
  messageText: string;

  @Prop({
    default: 'DEFAULT_MESSAGE',
    enum: [
      'DEFAULT_MESSAGE',
      'CONFIRM_ADOPT',
      'REQUEST_ADOPT',
      'CANCEL_REQUEST_ADOPT',
      'REJECT_ADOPT',
    ],
    type: String,
  })
  messageType: String;

  @Prop({ default: Date.now(), type: Date })
  createdAt: Date;
}

export const MessagesSchema = SchemaFactory.createForClass(Messages);
