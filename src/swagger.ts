import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Inno Task Tracker')
    .setDescription(
      `🚀 **Advanced Task Management API** with JWT Authentication, RBAC, Rate Limiting, and Production-Grade Features

## 🔐 Authentication
Use the **Authorize** button above to add your JWT token in format: \`Bearer your-token-here\`

## 📝 Quick Start Guide
1. **Create Account**: POST \`/auth/signup\` with email, password, and optional role
2. **Login**: POST \`/auth/login\` to get your JWT token
3. **Authorize**: Click the 🔒 button and paste your token
4. **Create Tasks**: POST \`/tasks\` with title, description, and due date
5. **Manage Tasks**: Use GET \`/tasks\` with filters, PATCH \`/tasks/{id}/status\` to update

## 🧪 Test Data Examples
**Signup/Login**:
- Email: \`john.doe@example.com\`
- Password: \`SecurePass123!\`

**Create Task**:
- Title: \`Complete project documentation\`
- Description: \`Write comprehensive API documentation for the task management system\`
- Due Date: \`2024-12-31T23:59:59.000Z\`

## 🏷️ Task Status Options
- \`OPEN\` - New or pending tasks
- \`IN_PROGRESS\` - Active work
- \`DONE\` - Completed tasks

## 👥 User Roles & Permissions
- \`USER\` - Basic task management
- \`MANAGER\` - Team task oversight
- \`ADMIN\` - Full system access`,
    )
    .setVersion('1.0')
    .setContact(
      'Innospace Infotech Ltd',
      'https://innospace-infotech.com',
      'support@innospace-infotech.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
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
    .addTag('General', '🏠 General API information and welcome endpoint')
    .addTag('Authentication', '🔐 User authentication and registration')
    .addTag('Tasks', '📋 Task management operations with RBAC')
    .addTag('Health', '❤️ Health check and monitoring endpoints')
    .build();
  const doc = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup('docs', app, doc, {
    customSiteTitle: 'Inno Task Tracker API',
    customfavIcon: '/favicon.ico',
    customCss: `
      .topbar-wrapper { content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABNmlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjarY6xSsNQFEDPi6LiUCsEcXB4kygotupgxqQtRRCs1SHJ1qShSmkSXl7VfoHBwUHELcIiEWTnH8jF/AQm...);}
      .swagger-ui .topbar { background-color: #1f2937; }
      .swagger-ui .topbar .download-url-wrapper { display: none; }
    `,
  });
}
