import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const method: string = request.method;
    const url: string = request.url;
    const body: unknown = request.body;
    const query = request.query;
    const params = request.params;

    const start = Date.now();

    this.logger.log(
      `Incoming Request: ${method} ${url} | Params: ${JSON.stringify(
        params,
      )} | Query: ${JSON.stringify(query)} | Body: ${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const time = Date.now() - start;
        this.logger.log(
          `Response: ${method} ${url} | Duration: ${time}ms | Response: ${JSON.stringify(
            data,
          )}`,
        );
      }),
    );
  }
}
