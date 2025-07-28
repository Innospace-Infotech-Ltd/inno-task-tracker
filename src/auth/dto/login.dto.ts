import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    example: 'user@gmail.com',
    description: 'User contact number',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: 'p@ssword',
    description: 'Password',
  })
  @IsString()
  password: string;
}
