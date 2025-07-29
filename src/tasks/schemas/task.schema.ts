import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TaskStatus } from 'src/@types/task.type';

@Schema()
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  dueDate?: Date;

  @Prop({ enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.index({ status: 1 });
