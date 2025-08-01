import { IsEnum } from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskStatusDto {
  @ApiProperty({
    enum: TaskStatus,
    description: 'The new status of the task',
    example: TaskStatus.IN_PROGRESS,
  })
  @IsEnum(TaskStatus, {
    message: `Status must be one of: ${Object.values(TaskStatus).join(', ')}`,
  })
  status: TaskStatus;
}
