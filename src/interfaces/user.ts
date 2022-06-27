import Address from './address';

export default interface UserInterface {
  email: string;
  firstName: string;
  address: Address;
  password: string;
  createdAt: Date;
}
