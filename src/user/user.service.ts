import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
// export type User = {
//   id: string;
//   name: string;
//   username: string;
//   password: string;
// };
import { User, UserDocument } from 'src/schemas/user.schema';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  // private readonly users: User[] = [
  //   {
  //     userDisplayName: 'A',
  //     username: 'Aa',
  //     password: '1234',
  //   },
  //   {
  //     userDisplayName: 'B',
  //     username: 'Bb',
  //     password: '1234',
  //   },
  // ];
  async create(createAuthDto: CreateAuthDto) {
    return new this.userModel(createAuthDto).save();
  }

  async findOne(username: string) {
    return this.userModel.findOne({ username: username }).exec();
  }

  async findOneById(id: string) {
    return this.userModel.findOne({ _id: id }).exec();
  }
}
