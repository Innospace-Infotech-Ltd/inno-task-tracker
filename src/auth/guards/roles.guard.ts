import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SetMetadata } from '@nestjs/common';

import { Request } from 'express';
import { UserRole } from 'src/@types/user.types';
export interface IRequest extends Request {
  session: any;
  user: any;
}

export const ROLES_KEY = 'roles';
export const HasRoles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const HasUserAccess = () => SetMetadata(ROLES_KEY, [UserRole.USER]);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request: IRequest = context.switchToHttp().getRequest();
    try {
      const user = request.user;
      return requiredRoles.some((role) => user.role == role);
    } catch (err) {
      console.error('Error in RolesGuard:', err);
      throw new UnauthorizedException();
    }
  }
}
