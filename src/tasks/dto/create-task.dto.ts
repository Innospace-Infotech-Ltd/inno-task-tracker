import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../schemas/task.schema';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example:
      'Write comprehensive API documentation for the task management system',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Due date in ISO format',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    default: TaskStatus.OPEN,
    description: 'Task status',
    example: TaskStatus.OPEN,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
