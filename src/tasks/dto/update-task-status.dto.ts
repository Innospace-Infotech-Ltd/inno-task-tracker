import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TaskStatus } from 'src/@types/task.type';

export class UpdateTaskStatusDto {
  @ApiProperty({
    required: true,
    example: 'OPEN',
    description: 'Update the status of the task',
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
