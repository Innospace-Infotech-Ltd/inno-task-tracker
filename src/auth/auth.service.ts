import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password } = signupDto;

    const exists = await this.userModel.findOne({ email });
    if (exists) {
      throw new ConflictException('Email already taken');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.userModel.create({ email, passwordHash });

    const payload = { sub: user._id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      id: (user._id as Types.ObjectId).toHexString(),
      email: user.email,
      accessToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      id: (user._id as Types.ObjectId).toHexString(),
      email: user.email,
      accessToken,
    };
  }

  async validateUser(payload: any) {
    const user = await this.userModel.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: (user._id as Types.ObjectId).toHexString(),
      email: user.email,
    };
  }
}
