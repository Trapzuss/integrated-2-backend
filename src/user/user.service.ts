import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import * as bcrypt from 'bcrypt';
import UserInterface from 'src/interfaces/user';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createAuthDto: CreateAuthDto) {
    try {
      const oldUser = await this.userModel.findOne({
        email: createAuthDto.email,
      });

      if (oldUser) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'This email already exist.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const saltOrRounds = 10;
      const password = createAuthDto.password;
      const hash = await bcrypt.hash(password, saltOrRounds);

      return new this.userModel({ ...createAuthDto, password: hash }).save();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findOne(email: string) {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async findOneById(id: string) {
    return await this.userModel
      .aggregate([
        { $addFields: { userId: { $toString: '$_id' } } },

        {
          $match: { userId: id },
        },
        { $project: { _id: 1, password: 0 } },
      ])
      .exec();
  }

  // { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
  // {
  //   $lookup: {
  //     from: 'users',
  //     localField: 'userObjectId',
  //     foreignField: '_id',
  //     as: 'user',
  //   },
  // },
  // { $project: { _id: 1, user: { password: 0 } } },

  async findOneByIdWithPost(id: string) {
    return await this.userModel
      .aggregate([
        { $addFields: { userId: { $toString: '$_id' } } },
        {
          $lookup: {
            from: 'posts',
            localField: 'userId',
            foreignField: 'userId',
            as: 'posts',
          },
        },
        {
          $match: { userId: id },
        },
        { $project: { _id: 1, password: 0 } },
      ])
      .exec();
  }

  async updateOne(id, data: UserInterface) {
    return await this.userModel
      .updateOne({ _id: id }, { $set: { ...data } })
      .exec();
  }
}
