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
  Session,
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
import { JwtAuthGuard } from './jwt-auth-guard';
import { Public } from 'src/utils/decorator';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): any {
    return this.authService.login(req.user);
  }

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    try {
      return this.authService.create(createAuthDto);
    } catch (error) {
      console.log('is in error');
      console.log(error);
      return error.response.data.message;
    }
  }

  @Post('logout')
  async logout(@Request() req, @Response({ passthrough: true }) res) {
    try {
      await req.session?.destroy();
      // console.log(req.session);
      res.clearCookie('connect.sid');

      return { msg: 'Log out' };
    } catch (error) {
      // console.log(error);
      return error.response.data.message;
    }
  }

  // @Get('session')
  // async getAuthStssion(@Session() session: Record<string, any>) {
  //   console.log(session);
  //   console.log(session.id);
  // console.log(session.id);
  // }

  // @UseGuards(AuthenticatedGuard)

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // console.log(req.user);
    if (req) {
      let user = req.user._doc;
      // console.log(req.user);
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

  // @UseGuards(AuthenticatedGuard)
  // @Get('protected')
  // getHello(@Request() req): any {
  //   return req.user;
  // }

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
