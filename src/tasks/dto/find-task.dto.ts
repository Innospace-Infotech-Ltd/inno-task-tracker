import {
  IsEnum,
  IsOptional,
  IsISO8601,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindTaskDto {
  @ApiProperty({
    enum: TaskStatus,
    required: false,
    description: 'Filter tasks by status',
    example: TaskStatus.OPEN,
  })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: `Status must be one of: ${Object.values(TaskStatus).join(', ')}`,
  })
  status?: TaskStatus;

  @ApiProperty({
    required: false,
    description: 'Filter tasks due from this date (ISO 8601)',
    example: '2025-08-01T00:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  dueFrom?: string;

  @ApiProperty({
    required: false,
    description: 'Filter tasks due until this date (ISO 8601)',
    example: '2025-08-31T23:59:59Z',
  })
  @IsOptional()
  @IsISO8601()
  dueTo?: string;

  @ApiProperty({
    required: false,
    description: 'Search tasks by title (case-insensitive)',
    example: 'project',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Page number for pagination',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    required: false,
    description: 'Number of items per page',
    minimum: 1,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
