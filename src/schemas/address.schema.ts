import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RandomUUIDOptions } from 'crypto';
import { Document } from 'mongoose';
import AddressInterface from 'src/interfaces/address';
import { v4 as uuidv4 } from 'uuid';
export type AddressDocument = Address & Document;

@Schema()
export class Address {
  @Prop({ required: true, type: String, default: uuidv4() })
  addressId: string;

  @Prop({ required: true, type: String })
  province: string;

  @Prop({ required: true, type: String })
  country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
