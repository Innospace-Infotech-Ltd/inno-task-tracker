import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTaskDto } from './dto/find-task.dto';
import { mongo } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';

/** Tasks management endpoints */
@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /** Create new task */
  @Post()
  async create(@Body() taskDto: CreateTaskDto) {
    try {
      const task = await this.tasksService.create(taskDto);

      if (!task) throw new Error('Task creation failed');

      return task;
    } catch (error: any) {
      throw new Error('Error creating task: ' + error.message);
    }
  }

  /** Get all tasks with filters and pagination */
  @Get()
  async findAll(@Query() query: FindTaskDto) {
    try {
      const result = await this.tasksService.findAll(query);

      if (!result || !result.data || !result.meta)
        throw new Error('No tasks found');

      return {
        data: result.data,
        meta: result.meta,
      };
    } catch (error: any) {
      throw new Error('Error retrieving tasks: ' + error.message);
    }
  }

  /** Update task status */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: mongo.ObjectId,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    try {
      const updatedTask = await this.tasksService.updateStatus(
        id,
        updateTaskStatusDto.status,
      );
      return updatedTask;
    } catch (error) {
      throw new Error('Error updating task status: ' + error.message);
    }
  }
}
