import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly redisService: RedisService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      status: createTaskDto.status || TaskStatus.OPEN,
    });
    const task = await createdTask.save();
    
    // Invalidate task list cache
    await this.redisService.delPattern('tasks:*');
    
    return task;
  }

  async findAll(
    status?: TaskStatus,
    dueFrom?: string,
    dueTo?: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const cacheKey = `tasks:${JSON.stringify({ status, dueFrom, dueTo, search, page, limit })}`;
    
    // Try to get from cache
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query: any = {};
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (dueFrom || dueTo) {
      query.dueDate = {};
      if (dueFrom) query.dueDate.$gte = new Date(dueFrom);
      if (dueTo) query.dueDate.$lte = new Date(dueTo);
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.taskModel.find(query).skip(skip).limit(limit).exec(),
      this.taskModel.countDocuments(query).exec(),
    ]);

    const result = {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache for 5 minutes
    await this.redisService.set(cacheKey, JSON.stringify(result), 300);
    
    return result;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.taskModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    
    // Invalidate task list cache
    await this.redisService.delPattern('tasks:*');
    
    return task;
  }
}
