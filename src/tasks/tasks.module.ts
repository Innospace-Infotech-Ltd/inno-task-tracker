import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { RedisModule } from '../redis/redis.module';
import { MonitoringModule } from '../common/monitoring/monitoring.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    RedisModule,
    MonitoringModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
