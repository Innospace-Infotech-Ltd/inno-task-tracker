import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WinstonLoggerService } from '../logger/logger.service';
import { MetricsService } from '../monitoring/metrics.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private logger: WinstonLoggerService,
    private metricsService: MetricsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.url === '/health/metrics') {
      return next.handle();
    }
    const response = context.switchToHttp().getResponse();
    const method = request.method;
    const url = request.url;
    const user = request.user;
    const userId = user?.userId || 'anonymous';
    const startTime = Date.now();

    this.logger.log(
      `Incoming Request: ${method} ${url} - User: ${userId}`,
      'LoggingInterceptor',
    );

    this.metricsService.incrementRequests(method, url, 0);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode || 200;

          this.metricsService.incrementRequests(method, url, statusCode);
          this.metricsService.recordResponseTime(method, url, duration);

          this.logger.log(
            `Response: ${method} ${url} - ${statusCode} - ${duration}ms - User: ${userId}`,
            'LoggingInterceptor',
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          this.metricsService.incrementRequests(method, url, statusCode);
          this.metricsService.incrementErrors(method, url, statusCode);
          this.metricsService.recordResponseTime(method, url, duration);

          this.logger.error(
            `Error: ${method} ${url} - ${statusCode} - ${duration}ms - User: ${userId}`,
            error.stack,
            'LoggingInterceptor',
          );
        },
      }),
    );
  }
}
