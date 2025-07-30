import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../schemas/task.schema';

export class GetTasksQueryDto {
  @ApiPropertyOptional({
    enum: TaskStatus,
    description: 'Filter by task status',
    example: TaskStatus.OPEN,
    examples: {
      open: { value: TaskStatus.OPEN },
      in_progress: { value: TaskStatus.IN_PROGRESS },
      done: { value: TaskStatus.DONE },
    },
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Filter tasks due from this date (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  dueFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter tasks due until this date (ISO string)',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsDateString()
  @IsOptional()
  dueTo?: string;

  @ApiPropertyOptional({
    description: 'Search in task titles (case-insensitive)',
    example: 'documentation',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    default: 1,
    minimum: 1,
    description: 'Page number',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    default: 10,
    minimum: 1,
    description: 'Items per page',
    example: 10,
    maximum: 100,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
