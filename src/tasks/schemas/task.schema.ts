import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@Schema({ timestamps: true })
export class Task extends Document {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Buy groceries',
  })
  @Prop({ required: true })
  title: string;

  @ApiPropertyOptional({
    description: 'The description of the task',
    example: 'Buy groceries for the week',
  })
  @Prop()
  description?: string;

  @ApiPropertyOptional({
    description: 'The due date of the task',
    example: '2025-01-01',
  })
  @Prop()
  dueDate?: Date;

  @ApiProperty({
    description: 'The status of the task',
    example: 'OPEN',
  })
  @Prop({ enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
