import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message =
        typeof errorResponse === 'string'
          ? errorResponse
          : (errorResponse as any).message || 'An error occurred';
      error = exception.name;
    } else if (exception instanceof MongoError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.handleMongoError(exception);
      error = 'DatabaseError';
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = exception.name;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Unknown error occurred';
      error = 'UnknownError';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
    };

    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify({
        userId: (request as any).user?.userId,
        stack: exception instanceof Error ? exception.stack : exception,
        ...errorResponse,
      }),
    );

    response.status(status).json(errorResponse);
  }

  private handleMongoError(error: MongoError): string {
    switch (error.code) {
      case 11000:
        return 'Duplicate entry found';
      case 121:
        return 'Document validation failed';
      default:
        return 'Database operation failed';
    }
  }
}
