import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { PaginationMeta } from '../common/dto/pagination.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.status = updateTaskDto.status;

    return task.save();
  }

  async getTasks(query: GetTasksQueryDto): Promise<{
    data: Task[];
    meta: PaginationMeta;
  }> {
    const { status, dueFrom, dueTo, search, page = 1, limit = 10 } = query;
    const filter: Record<string, any> = {};

    if (status) {
      filter.status = status;
    }
    const dueDateFilter: Record<string, Date> = {};
    if (dueFrom) {
      dueDateFilter.$gte = new Date(dueFrom);
    }
    if (dueTo) {
      dueDateFilter.$lte = new Date(dueTo);
    }
    if (Object.keys(dueDateFilter).length > 0) {
      filter.dueDate = dueDateFilter;
    }
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.taskModel.find(filter).skip(skip).limit(limit),
      this.taskModel.countDocuments(filter),
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
}
