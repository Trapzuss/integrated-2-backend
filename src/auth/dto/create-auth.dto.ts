import { isString } from 'util';

export class CreateAuthDto {
  userDisplayName: string;
  username: string;
  password: string;
  postList?: Array<any>;
}
