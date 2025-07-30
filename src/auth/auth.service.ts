import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from './schemas/user.schema';
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

  async signup(
    signupDto: SignupDto,
  ): Promise<{ user: any; access_token: string }> {
    const { email, password, role } = signupDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role
    const user = new this.userModel({
      email,
      password: hashedPassword,
      role: role || UserRole.USER, // Default to USER role if not specified
    });

    await user.save();

    // Generate JWT token
    const payload = {
      email: user.email,
      sub: user._id.toString(),
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      access_token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      id: (user._id as Types.ObjectId).toHexString(),
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      accessToken,
    };
  }

  async validateUser(payload: any) {
    const user = await this.userModel.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      userId: (user._id as Types.ObjectId).toHexString(),
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }
}
