import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      status: createTaskDto.status || TaskStatus.OPEN,
    });
    return createdTask.save();
  }

  async findAll(
    status?: TaskStatus,
    dueFrom?: string,
    dueTo?: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ) {
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

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.taskModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
}
