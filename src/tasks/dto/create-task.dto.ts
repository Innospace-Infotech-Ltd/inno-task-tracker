import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';
import { Transform } from 'class-transformer';
import { trimString } from '../../common/utils/trimStringTransform.util';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Buy groceries',
  })
  @Transform(trimString)
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({
    description: 'The description of the task',
    example: 'Buy groceries for the week',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(3)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The due date of the task',
    example: '2025-01-01',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'The status of the task',
    example: 'OPEN',
  })
  @Transform(trimString)
  @IsEnum(TaskStatus)
  status?: TaskStatus = TaskStatus.OPEN;
}
