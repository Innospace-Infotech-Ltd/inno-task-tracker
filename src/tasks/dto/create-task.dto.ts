import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../schemas/task.schema';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete NestJS assignment', description: 'Task title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Implement all required endpoints', required: false, description: 'Task description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2024-12-31', required: false, description: 'Due date in ISO format' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ example: 'OPEN', enum: TaskStatus, required: false, description: 'Task status' })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}

export class UpdateTaskStatusDto {
  @ApiProperty({ example: 'IN_PROGRESS', enum: TaskStatus, description: 'New task status' })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}