import { TaskStatus } from '../schemas/task.schema';
import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsISO8601,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Complete project documentation',
  })
  @IsString()
  title: string;

  @ApiProperty({
    required: false,
    description: 'A detailed description of the task',
    example: 'Write comprehensive documentation for the API endpoints',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    description: 'The due date for the task (ISO 8601)',
    example: '2025-08-31T23:59:59Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @ApiProperty({
    required: false,
    enum: TaskStatus,
    description: 'The status of the task',
    example: TaskStatus.OPEN,
    default: TaskStatus.OPEN,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
