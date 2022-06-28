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

  async create(createPostDto: CreatePostDto): Promise<Posts> {
    return new this.postModel(createPostDto).save();
  }

  async findAllComputed(userId: string): Promise<any> {
    let posts = await this.postModel
      .aggregate([
        { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
        { $addFields: { postIdString: { $toString: '$_id' } } },
        {
          $lookup: {
            from: 'users',
            localField: 'userObjectId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $lookup: {
            from: 'chats',
            localField: 'postIdString',
            foreignField: 'postId',
            as: 'chat',
          },
        },

        { $project: { _id: 1, user: { password: 0 }, chat: { messages: 0 } } },
      ])
      .exec();
    // console.log(userId);
    let postsComputed = posts.filter((post: any) =>
      post?.chat?.filter((el: any) => el?.participants?.includes(userId)),
    );

    // let postsMapped = postsComputed.map((post) => {
    //   return { ...post, chat: { ...post?.chat[0] } };
    // });
    let postsMapped = [];
    for (let post of postsComputed) {
      let toUser;
      let participants = post?.chat[0]?.participants;
      // console.log(participants);
      if (participants != undefined) {
        // console.log(participants);
        for (let participantId of participants) {
          if (participantId != userId) {
            toUser = await this.userModel.findOne(
              { _id: participantId },
              { password: 0, address: 0 },
            );
          }
        }
      }
      let payload = { ...post, chat: { ...post?.chat[0], toUser } };
      postsMapped.push(payload);
    }
    // console.log(postsMapped);

    // console.log(result);
    return postsMapped;
  }

  async findAll(): Promise<Posts[]> {
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
        { $unwind: '$user' },
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
        { $unwind: '$user' },
        { $match: { userId: userId } },
        { $project: { _id: 1, user: { password: 0 } } },
      ])
      .exec();
  }

  async findWithKeyword(keyword) {
    // return await this.postModel.find({
    //   $or: [
    //     { description: { $regex: keyword } },
    //     { petName: { $regex: keyword } },
    //   ],
    // });
    return this.postModel.aggregate([
      { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
      {
        $lookup: {
          from: 'users',
          localField: 'userObjectId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $match: {
          $or: [
            { petName: { $regex: keyword } },
            { description: { $regex: keyword } },
          ],
        },
      },

      { $project: { _id: 1, user: { password: 0 } } },
    ]);
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
        { $unwind: '$user' },
        { $match: { postId: id } },
        { $project: { _id: 1, user: { password: 0 } } },
      ])
      .exec();
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      return this.postModel
        .updateOne(
          { _id: id },
          { $set: { ...updatePostDto, updatedAt: Date.now() } },
        )
        .exec();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async remove(id: string) {
    return this.postModel.deleteOne({ _id: id }).exec();
  }
}
