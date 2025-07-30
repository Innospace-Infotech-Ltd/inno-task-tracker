import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = this.formatErrors(validationErrors);
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors,
        });
      },
    });
  }

  private formatErrors(errors: ValidationError[]): any {
    return errors.reduce((result, error) => {
      if (error.children && error.children.length > 0) {
        result[error.property] = this.formatErrors(error.children);
      } else {
        result[error.property] = Object.values(error.constraints || {});
      }
      return result;
    }, {});
  }
}
