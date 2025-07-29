import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from 'src/@types/task.type';

export class TaskQueryDto {
  @ApiProperty({
    required: false,
    example: 'OPEN',
    description: 'Filter tasks by status',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    required: false,
    example: new Date().toISOString(),
    description: 'Filter tasks created after this date',
  })
  @IsOptional()
  @IsDateString()
  dueFrom?: Date;

  @ApiProperty({
    required: false,
    example: new Date().toISOString(),
    description: 'Filter tasks created before this date',
  })
  @IsOptional()
  @IsDateString()
  dueTo?: Date;

  @ApiProperty({
    required: false,
    example: 'inno',
    description: 'case-insensitive partial match on title of the plan',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    example: '1',
    description: 'Page number for pagination',
  })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiProperty({
    required: false,
    example: '10',
    description: 'Number of items per page for pagination',
  })
  @IsOptional()
  @IsString()
  limit?: string;
}
