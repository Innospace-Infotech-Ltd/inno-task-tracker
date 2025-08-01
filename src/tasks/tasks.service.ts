import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, mongo } from 'mongoose';
import { Task, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTaskDto } from './dto/find-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  /** Creates a new task */
  async create(taskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = new this.taskModel(taskDto);
      return await task.save();
    } catch (error) {
      throw new Error('Error creating task: ' + error);
    }
  }

  /** Finds tasks with filtering and pagination */
  async findAll(query: FindTaskDto): Promise<{
    data: Task[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    try {
      const { status, dueFrom, dueTo, search, page = 1, limit = 10 } = query;
      const filter: FilterQuery<Task> = {};

      // Apply filters
      if (status) {
        filter.status = status;
      }

      if (dueFrom || dueTo) {
        filter.dueDate = {
          ...(dueFrom && { $gte: new Date(dueFrom) }),
          ...(dueTo && { $lte: new Date(dueTo) }),
        };
      }

      if (search) {
        filter.title = { $regex: search, $options: 'i' };
      }

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.taskModel.find(filter).skip(skip).limit(limit).exec(),
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
    } catch (error) {
      throw new Error('Error fetching tasks: ' + error);
    }
  }

  /** Updates task status by ID */
  async updateStatus(id: mongo.ObjectId, status: TaskStatus): Promise<Task> {
    const task = await this.taskModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!task) {
      throw new NotFoundException(`Task with ID ${id.toString()} not found`);
    }

    return task;
  }
}
