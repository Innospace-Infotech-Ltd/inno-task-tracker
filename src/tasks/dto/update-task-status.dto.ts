import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../schemas/task.schema';

export class UpdateTaskStatusDto {
  @ApiProperty({
    enum: TaskStatus,
    description: 'New task status',
    example: TaskStatus.IN_PROGRESS,
    examples: {
      open: { value: TaskStatus.OPEN, description: 'Mark task as open' },
      in_progress: {
        value: TaskStatus.IN_PROGRESS,
        description: 'Mark task as in progress',
      },
      done: { value: TaskStatus.DONE, description: 'Mark task as completed' },
    },
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
