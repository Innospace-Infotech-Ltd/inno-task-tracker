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

  async createTask(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      status: createTaskDto.status || TaskStatus.OPEN,
      userId: userId,
    });
    const task = await createdTask.save();
    
    // Invalidate task list cache for this user
    await this.redisService.delPattern(`tasks:user:${userId}:*`);
    
    return task;
  }

  async findAll(
    userId: string,
    userRoles: string[],
    status?: TaskStatus,
    dueFrom?: string,
    dueTo?: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const isAdmin = userRoles.includes('admin');
    const cacheKey = isAdmin 
      ? `tasks:admin:${JSON.stringify({ status, dueFrom, dueTo, search, page, limit })}`
      : `tasks:user:${userId}:${JSON.stringify({ status, dueFrom, dueTo, search, page, limit })}`;
    
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query: any = isAdmin ? {} : { userId };
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

  async updateTaskStatus(id: string, status: TaskStatus, userId: string, userRoles: string[]): Promise<Task> {
    const isAdmin = userRoles.includes('admin');
    const query = isAdmin ? { _id: id } : { _id: id, userId: userId };
    
    const task = await this.taskModel.findOneAndUpdate(
      query,
      { status },
      { new: true }
    ).exec();
    if (!task) {
      throw new NotFoundException('Task not found or not owned by user');
    }
    
    // Invalidate both admin and user caches
    await this.redisService.delPattern('tasks:admin:*');
    await this.redisService.delPattern('tasks:user:*');
    
    return task;
  }
}
