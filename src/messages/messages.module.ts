import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Messages, MessagesSchema } from 'src/schemas/message.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Messages.name, schema: MessagesSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
