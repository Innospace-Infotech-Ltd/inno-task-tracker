import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const taskData: any = {
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: createTaskDto.status || TaskStatus.OPEN,
    };

    if (createTaskDto.dueDate) {
      taskData.dueDate = new Date(createTaskDto.dueDate);
    }

    const task = new this.taskModel(taskData);
    return task.save();
  }

  async findAll(query: GetTasksQueryDto) {
    const { status, dueFrom, dueTo, search, page = 1, limit = 10 } = query;

    const filter: any = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Date range filter
    if (dueFrom || dueTo) {
      filter.dueDate = {};
      if (dueFrom) {
        filter.dueDate.$gte = new Date(dueFrom);
      }
      if (dueTo) {
        filter.dueDate.$lte = new Date(dueTo);
      }
    }

    // Search filter (case-insensitive)
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.taskModel.find(filter).skip(skip).limit(limit).exec(),
      this.taskModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async updateStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Task not found');
    }

    const task = await this.taskModel.findByIdAndUpdate(
      id,
      { status: updateTaskStatusDto.status },
      { new: true },
    );

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
