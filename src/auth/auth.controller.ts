import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  UseGuards,
  Request,
  Res,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
// import { Request } from '@nestjs/common';

import * as firebase from 'firebase-admin';
import { get } from 'http';
import { LocalAuthGuard } from './local-auth-guard';
import { AuthenticatedGuard } from './authenticated.guard';
import { UserService } from 'src/user/user.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): any {
    return { msg: 'Logged in!' };
  }

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('logout')
  logout(@Request() req, @Response() res) {
    return this.authService.logout();
  }

  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  getProfile(@Request() req) {
    if (req) {
      let user = req.user._doc;
      // console.log(req.user._doc);
      return {
        _id: user._id,
        username: user.username,
        userDisplayName: user.userDisplayName,
      };
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':username')
  getProfileByUsername(@Param('username') username: string) {
    return this.userService.findOne(username);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('protected')
  getHello(@Request() req): any {
    // return this.authService.findAll();
    return req.user;
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
