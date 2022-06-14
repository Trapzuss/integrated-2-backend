import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RandomUUIDOptions } from 'crypto';
import { Document } from 'mongoose';
import Address from 'src/interfaces/address';
import { v4 as uuidv4 } from 'uuid';
import { AddressDocument, AddressSchema } from './address.schema';
export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ required: true, type: AddressSchema })
  address: Address;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
