import Address from 'src/interfaces/address';
import { isString } from 'util';

export class CreateAuthDto {
  email: string;
  firstName: string;
  lastName: string;
  address: Address;
  password: string;
  createdAt: Date;
}
