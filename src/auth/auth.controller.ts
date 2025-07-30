import { Body, Controller, Post, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account and returns authentication token',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created',
    schema: {
      example: {
        id: '688a922abc2e0a4619b61583',
        email: 'john.doe@example.com',
        role: 'user',
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODhhOTIyYWJjMmUwYTQ2MTliNjE1ODMiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTM5MTE4NTYsImV4cCI6MTc1NDUxNjY1Nn0.UQBUQ6rB5E7bnpTB3bgngLYdRRWxbWgq7COd1bfAzwQ',
        isActive: true,
        createdAt: '2025-07-30T21:40:00.000Z',
        updatedAt: '2025-07-30T21:40:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Email already taken' })
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Authenticate user',
    description: 'Authenticate user with email and password, returns JWT token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully authenticated',
    schema: {
      example: {
        id: '688a922abc2e0a4619b61583',
        email: 'john.doe@example.com',
        role: 'user',
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODhhOTIyYWJjMmUwYTQ2MTliNjE1ODMiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTM5MTE4NTYsImV4cCI6MTc1NDUxNjY1Nn0.UQBUQ6rB5E7bnpTB3bgngLYdRRWxbWgq7COd1bfAzwQ',
        isActive: true,
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
