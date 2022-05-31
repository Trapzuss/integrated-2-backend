import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Messages, MessagesDocument } from 'src/schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Model } from 'mongoose';
import { Message } from './entities/message.entity';
import { User, UserDocument } from 'src/schemas/user.schema';
@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Messages.name) private messageModel: Model<MessagesDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  messages: Message[] = [{ name: 'Rukia', text: 'hi' }];
  clientToUser = {};

  create(createMessageDto: CreateMessageDto) {
    // return 'This action adds a new message';
    const message = { ...createMessageDto };
    this.messages.push(message); //TODO improve userId
    return message;
  }

  findAll() {
    return this.messages;
    // return `This action returns all messages`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  getClientByName(clientId: string) {
    return this.clientToUser[clientId];
  }

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser);
  }
}
