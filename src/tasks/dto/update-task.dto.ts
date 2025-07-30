import { IsEnum } from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'The status of the task. Can be OPEN, IN_PROGRESS, COMPLETED.',
    example: 'IN_PROGRESS',
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
