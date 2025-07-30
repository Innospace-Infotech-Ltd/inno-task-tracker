import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { setupSwagger } from './swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Only apply production filters and interceptors in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    // Global exception filter for comprehensive error handling
    app.useGlobalFilters(new AllExceptionsFilter());

    // Global logging interceptor for request/response monitoring
    app.useGlobalInterceptors(new LoggingInterceptor());
  }

  // Global validation pipe with advanced options
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // Setup Swagger documentation
  setupSwagger(app);

  // Enable CORS for development
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors();
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
