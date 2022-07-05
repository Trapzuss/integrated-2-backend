import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chats, ChatsDocument } from 'src/schemas/chat.schema';
import { Posts, PostsDocument } from 'src/schemas/post.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chats.name) private chatModel: Model<ChatsDocument>,
    @InjectModel(Posts.name) private postModel: Model<PostsDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    return await this.chatModel.create(createChatDto);
  }

  async findUserChatById(userId: String) {
    // console.log(userId);

    let res = await this.chatModel.aggregate([
      { $addFields: { postObjectId: { $toObjectId: '$postId' } } },
      {
        $lookup: {
          from: 'posts',
          localField: 'postObjectId',
          foreignField: '_id',
          as: 'post',
        },
      },
      { $unwind: '$post' },
      { $addFields: { userObjectId: { $toObjectId: '$post.userId' } } },
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
    ]);
    // console.log(res);

    let chats = [];
    let result = [];
    if (res.length != 0) {
      chats = res.filter((chat) => {
        return chat.participants.includes(userId);
      });
      // console.log(chats);
      if (chats.length != 0) {
        let toUser = {};
        for (let chat of chats) {
          for (let participantId of chat?.participants) {
            if (participantId != userId) {
              // console.log(participantId);
              let toUserData = await this.userModel.findOne(
                { _id: participantId },
                { password: 0, address: 0 },
              );

              toUser = toUserData;
              // console.log(toUserData);
            }
          }

          result.push({ ...chat, toUser: toUser });
        }
      }
    }
    // filter by updatedAt
    result.sort((a, b) => b.updatedAt - a.updatedAt);
    // postsComputed.sort((a, b) => b.createdAt - a.createdAt);
    return result;
  }

  findAll() {
    return `This action returns all chats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
