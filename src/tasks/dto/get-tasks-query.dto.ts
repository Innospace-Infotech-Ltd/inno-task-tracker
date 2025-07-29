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

export class GetTasksQueryDto {
  @Transform(trimString)
  @IsOptional()
  @IsString()
  search?: string;

  @Transform(trimString)
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @Transform(trimString)
  @IsOptional()
  @IsDateString()
  dueFrom?: string;

  @Transform(trimString)
  @IsOptional()
  @IsDateString()
  dueTo?: string;

  @Transform(trimString)
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @Transform(trimString)
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
