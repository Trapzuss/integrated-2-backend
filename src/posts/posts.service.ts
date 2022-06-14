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

  async findNewest(): Promise<Posts[]> {
    return this.postModel.find();
  }

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
    return this.postModel.find().exec();
  }

  // findOne(id: string): any {
  //   return this.postModel.findOne({ _id: id }).exec();
  // }
  async findOne(id: string) {
    let post = (await this.postModel.findOne({ _id: id })) as any;
    let user = await this.userModel.findOne({ _id: post.userId });
    let res = { ...post._doc, user: user };
    return res;
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
