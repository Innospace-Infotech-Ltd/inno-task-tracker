import {
  Injectable,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ErrorCode } from 'src/@types/error.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const exists = await this.findByEmail(email);
    if (exists) throw new ConflictException('Email already taken');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({ email, passwordHash });
    return {
      id: (user._id as Types.ObjectId).toHexString(),
      email: user.email,
    };
  }

  async login(loginData: LoginDto) {
    const user = await this.findByEmail(loginData.email);
    if (!user) {
      throw new HttpException(
        {
          message: `User authentication failed`,
          code: ErrorCode.USER_NOT_FOUND,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const match = await bcrypt.compare(loginData.password, user.passwordHash);

    if (!match) {
      throw new HttpException(
        {
          message: `Invalid login credentials`,
          code: ErrorCode.INVALID_LOGIN_CRED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const jwtToken = await this.jwtService.signAsync({
      sub: user._id,
      id: user._id,
      email: user.email,
    });

    return {
      message: 'Login successful',
      accessToken: jwtToken,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
