import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@Schema({ timestamps: true })
export class Task extends Document {
  @ApiProperty({
    example: 'Complete NestJS assignment',
    description: 'Task title',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    example: 'Implement all required endpoints',
    required: false,
    description: 'Task description',
  })
  @Prop()
  description?: string;

  @ApiProperty({
    example: '2024-12-31T00:00:00.000Z',
    required: false,
    description: 'Task due date',
  })
  @Prop()
  dueDate?: Date;

  @ApiProperty({
    example: 'OPEN',
    enum: TaskStatus,
    description: 'Task status',
  })
  @Prop({ enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'User ID who owns this task',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({ userId: 1, title: 1 });
