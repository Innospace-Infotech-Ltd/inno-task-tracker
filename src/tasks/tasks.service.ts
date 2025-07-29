import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model } from 'mongoose';
import { TaskQueryDto } from './dto/task-query.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createTask(taskData: CreateTaskDto) {
    const createdTask = new this.taskModel(taskData);
    return await createdTask.save();
  }

  async getTasks(query: Partial<TaskQueryDto>) {
    const { status, dueFrom, dueTo, search, page = '1', limit = '10' } = query;
    const filter: any = {};

    if (status) filter.status = status;
    if (dueFrom)
      filter.dueDate = { ...filter.dueDate, $gte: new Date(dueFrom) };
    if (dueTo) filter.dueDate = { ...filter.dueDate, $lte: new Date(dueTo) };
    if (search) filter.title = new RegExp(search, 'i');

    const options = {
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
    };

    const tasks = await this.taskModel
      .find(filter)
      .skip(options.skip)
      .limit(options.limit)
      .select('-__v')
      .exec();

    const totalCount = await this.taskModel.countDocuments(filter).exec();

    const returnData = {
      data: tasks,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / Number(limit)),
      },
    };

    return returnData;
  }

  async findOne(query: any) {
    return await this.taskModel.findOne(query).exec();
  }

  async updateTaskStatus(_id: string, status: string) {
    return await this.taskModel
      .findByIdAndUpdate(_id, { status }, { new: true })
      .exec();
  }
}
