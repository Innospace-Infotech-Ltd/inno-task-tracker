import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';

export class SignupDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'SecurePass123!',
    minLength: 6,
    format: 'password',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
    required: false,
    default: UserRole.USER,
    examples: {
      user: {
        value: UserRole.USER,
        description: 'Regular user with basic permissions',
      },
      manager: {
        value: UserRole.MANAGER,
        description: 'Manager with additional permissions',
      },
      admin: {
        value: UserRole.ADMIN,
        description: 'Administrator with full access',
      },
    },
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
