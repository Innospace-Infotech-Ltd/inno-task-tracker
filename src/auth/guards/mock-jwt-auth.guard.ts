import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class MockJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // Mock user for testing
    request.user = {
      id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
    };
    return true;
  }
}
