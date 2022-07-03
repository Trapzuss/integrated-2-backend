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
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $addFields: { adoptedByUserId: { $toObjectId: '$adoptedBy' } } },
        {
          $lookup: {
            from: 'users',
            localField: 'adoptedByUserId',
            foreignField: '_id',
            as: 'adoptedUser',
          },
        },

        {
          $unwind: {
            path: '$adoptedUser',
            preserveNullAndEmptyArrays: true,
          },
        },
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

    // filter only participation chat
    let postsComputed = [];
    for (let [i, post] of posts.entries()) {
      // console.log(userId);
      if (post?.chat.length == 0) {
        // console.log(post.chat);
        // console.log('no chat');
        postsComputed.push(post);
      } else {
        // TODO fix this
        let includedChat = post?.chat.find((chat: any) => {
          // console.log(chat);
          return chat?.participants.includes(userId);
        });
        if (includedChat) {
          postsComputed.push(post);
        } else {
          postsComputed.push(post);
        }

        // for (let [i, chat] of post?.chat.entries()) {
        //   if (chat?.participants.includes(userId)) {
        //     postsComputed.push(post);
        //   } else {
        //     let postNoChat = { ...post, chat: {} };
        //     postsComputed.push(postNoChat);
        //   }
        // }
        // postsComputed.push(post);
      }
    }
    // return postsComputed;

    postsComputed.sort((a, b) => b.createdAt - a.createdAt);

    // get toUser
    let postsMapped = [];
    for (let post of postsComputed) {
      let toUser;
      let participants = post?.chat[0]?.participants;

      if (participants != undefined) {
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

    return postsMapped;
  }

  async findAllTypeQuery(type: string, userId: string) {
    let results = [];
    let posts = await this.findAllComputed(userId);
    // console.log(type);
    // return posts;
    for (let post of posts) {
      if (type == 'available') {
        if (post?.adoptedBy == null) {
          results.push(post);
        }
      }
    }
    return results;
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
    return await this.postModel
      .aggregate([
        { $addFields: { userObjectId: { $toObjectId: '$userId' } } },
        { $addFields: { adoptedByUserId: { $toObjectId: '$adoptedBy' } } },
        {
          $lookup: {
            from: 'users',
            localField: 'userObjectId',
            foreignField: '_id',
            as: 'user',
          },
        },

        {
          $lookup: {
            from: 'users',
            localField: 'adoptedByUserId',
            foreignField: '_id',
            as: 'adoptedUser',
          },
        },

        { $match: { userId: userId } },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$adoptedUser',
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            user: { password: 0 },
            adoptedUser: { password: 0 },
          },
        },
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
            { petName: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { 'address.district': { $regex: keyword, $options: 'i' } },
            { 'address.province': { $regex: keyword, $options: 'i' } },
            { 'address.country': { $regex: keyword, $options: 'i' } },
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
