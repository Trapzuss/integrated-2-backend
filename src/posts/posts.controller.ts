import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from 'src/schemas/post.schema';
import { UserService } from 'src/user/user.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly userService: UserService,
  ) {}

  // Basic CRUD
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    // console.log(createPostDto);
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAllWithUserId(
    @Query('userId') userId: string,
    @Query('keyword') keyword: string,
  ) {
    if (!userId && !keyword) {
      return this.postsService.findAll();
    }
    if (userId) {
      return this.postsService.findAllWithUserId(userId);
    }
    if (keyword) {
      return this.postsService.findWithKeyword(keyword);
    }
  }

  @Get()
  findAll() {
    // console.log('findAll');

    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): any {
    let post = this.postsService.findOne(id);
    return post;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
