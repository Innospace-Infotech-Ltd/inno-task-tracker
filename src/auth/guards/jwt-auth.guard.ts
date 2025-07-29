import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorCode } from 'src/@types/error.types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err, user, info) {
    if (err || !user) {
      throw (
        err ||
        new HttpException(
          {
            code: ErrorCode.NOT_LOGGED_IN,
            message: 'You are not logged in',
          },
          HttpStatus.UNAUTHORIZED,
        )
      );
    }

    return user;
  }
}
