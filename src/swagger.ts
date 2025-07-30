import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Inno Task Tracker')
    .setDescription(
      `**Advanced Task Management API** with JWT Authentication, Role-Based Access Control, Rate Limiting, and Production-Grade Features`,
    )
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Development Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token (without "Bearer" prefix)',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('General', 'General API information and welcome endpoint')
    .addTag('Authentication', 'User authentication and registration')
    .addTag(
      'Tasks',
      'Task management operations with Role-Based Access Control',
    )
    .addTag('Health', 'Health check and monitoring endpoints')
    .build();
  const doc = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup('docs', app, doc);
}
