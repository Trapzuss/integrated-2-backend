import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Public } from 'src/utils/decorator';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = (await this.usersService.findOne(email)) as any;
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const { password, username, ...result } = user;

      return result;
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Email or Password are not correct',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async login(user: any) {
    const doc = user._doc;

    const payload = { email: doc.email, sub: doc._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async create(createAuthDto: CreateAuthDto): Promise<User> {
    try {
      return this.usersService.create(createAuthDto);
    } catch (error) {
      console.log('is in error');
      console.log(error);
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
