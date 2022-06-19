import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto) {
    return this.userService.updateOne(id, updateUserDto);
  }

  @Get(':id')
  findOneWithPost(
    @Param('id') id: string,
    @Query('post') withPost: boolean,
  ): any {
    if (withPost == null) {
      return this.userService.findOneById(id);
    }
    return this.userService.findOneByIdWithPost(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): any {
    return this.userService.findOneById(id);
  }
}
