import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TaskStatus } from '../schemas/task.schema';
import { trimString } from '../../common/utils/trimStringTransform.util';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTasksQueryDto {
  @ApiPropertyOptional({
    description: 'The search query',
    example: 'groceries',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'The status of the task. Can be OPEN, IN_PROGRESS, COMPLETED.',
    example: 'IN_PROGRESS',
  })
  @Transform(trimString)
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'The due date from',
    example: '2025-01-01',
  })
  @Transform(trimString)
  @IsOptional()
  @IsDateString()
  dueFrom?: string;

  @ApiPropertyOptional({
    description: 'The due date to',
    example: '2025-01-01',
  })
  @Transform(trimString)
  @IsOptional()
  @IsDateString()
  dueTo?: string;

  @ApiPropertyOptional({
    description: 'The page number',
    example: 1,
  })
  @Transform(trimString)
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'The number of items per page',
    example: 10,
  })
  @Transform(trimString)
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
