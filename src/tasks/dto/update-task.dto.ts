import { IsEnum } from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';

export class UpdateTaskDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
