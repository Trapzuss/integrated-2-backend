import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Chats, ChatsSchema } from 'src/schemas/chat.schema';
import { Messages, MessagesSchema } from 'src/schemas/message.schema';
import { Posts, PostsSchema } from 'src/schemas/post.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chats.name, schema: ChatsSchema },
      { name: Messages.name, schema: MessagesSchema },
      { name: Posts.name, schema: PostsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
