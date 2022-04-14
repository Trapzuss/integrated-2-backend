import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from 'src/schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}
  async create(createPostDto: CreatePostDto): Promise<Post> {
    return new this.postModel(createPostDto).save();
  }

  findAll() {
    return this.postModel.find();
  }

  findOne(id: string) {
    // console.log(id);
    return this.postModel.findOne({ id });
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel.updateOne({ id }, { $set: { ...updatePostDto } });
  }

  remove(id: string) {
    return this.postModel.deleteOne({ id });
  }
}
