import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    required: true,
    example: 'inno-task-tracker',
    description: 'Title of the task',
  })
  @IsString()
  title: string;

  @ApiProperty({
    required: false,
    example: 'This is a sample task description',
    description: 'Description of the task',
  })
  @IsOptional()
  @IsString()
  @Length(20, 300)
  description?: string;

  @ApiProperty({
    required: false,
    example: '2023-10-01T00:00:00Z',
    description: 'Due date for the task',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
