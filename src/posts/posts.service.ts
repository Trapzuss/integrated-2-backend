import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts, PostsDocument } from 'src/schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postModel: Model<PostsDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // async increaseFavorite(id: string) {
  //   let post = this.postModel.findOne({ _id: id }).exec();
  //   let amount = (await post).favoriteAmount + 1;
  //   let response = this.postModel.updateOne(
  //     { _id: id },
  //     { $set: { ...post, favoriteAmount: amount } },
  //   );

  //   return response;
  // }

  // Essential CRUD
  async create(createPostDto: CreatePostDto): Promise<Posts> {
    return new this.postModel(createPostDto).save();
  }

  async findAll(): Promise<Posts[]> {
    // db.posts.aggregate([
    //   { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'userObjectId',
    //       foreignField: '_id',
    //       as: 'user',
    //     },
    //   },
    //   { $project: { _id: 1, user: { password: 0 } } },
    // ]);
    return this.postModel
      .aggregate([
        { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
        {
          $lookup: {
            from: 'users',
            localField: 'userObjectId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $project: { _id: 1, user: { password: 0 } } },
      ])
      .exec();
  }

  async findAllWithUserId(userId: string) {
    return this.postModel
      .aggregate([
        { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
        {
          $lookup: {
            from: 'users',
            localField: 'userObjectId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $match: { userId: userId } },
        { $project: { _id: 1, user: { password: 0 } } },
      ])
      .exec();
  }

  async findOne(id: string) {
    return await this.postModel
      .aggregate([
        { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
        { $addFields: { postId: { $toString: '$_id' } } },
        {
          $lookup: {
            from: 'users',
            localField: 'userObjectId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $match: { postId: id } },
        { $project: { _id: 1, user: { password: 0 } } },
      ])
      .exec();
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel
      .updateOne({ _id: id }, { $set: { ...updatePostDto } })
      .exec();
  }

  async remove(id: string) {
    return this.postModel.deleteOne({ _id: id }).exec();
  }
}
