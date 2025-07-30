import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonLoggerService } from '../logger/logger.service';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(private logger: WinstonLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    const userId = user?._id || 'anonymous';
    const userEmail = user?.email || 'anonymous';
    const requestId = req.headers['x-request-id'];

    // Log authentication attempts
    if (req.url.includes('/auth/')) {
      this.logger.log(
        `AUTH: ${req.method} ${req.url} - User: ${userEmail} (${userId}) - IP: ${req.ip}`,
        'AuditMiddleware',
      );
    }

    // Log task operations
    if (req.url.includes('/tasks')) {
      const taskData = {
        userId,
        userEmail,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        requestId,
        body: req.method !== 'GET' ? req.body : undefined,
      };

      this.logger.log(
        `TASK_OPERATION: ${JSON.stringify(taskData)}`,
        'AuditMiddleware',
      );
    }

    next();
  }
}
