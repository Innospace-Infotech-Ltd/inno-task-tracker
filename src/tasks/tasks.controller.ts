import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { ErrorCode } from 'src/@types/error.types';

@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);
  constructor(private readonly tasksService: TasksService) {}

  private notImpl() {
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  @Post()
  async createTask(@Body() taskData: CreateTaskDto) {
    try {
      const createdTask = await this.tasksService.createTask(taskData);
      return createdTask;
    } catch (error) {
      if (error.status) throw error;
      throw new InternalServerErrorException();
    }
  }
  @Get()
  async getTasks(@Query() query: TaskQueryDto) {
    try {
      const tasks = await this.tasksService.getTasks(query);
      return tasks;
    } catch (error) {
      if (error.status) throw error;
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id/status')
  async updateTask(
    @Param('id') _id: string,
    @Body() body: UpdateTaskStatusDto,
  ) {
    try {
      this.logger.log(`Got request to update task status for ID: ${_id}`);
      const task = await this.tasksService.findOne({ _id });
      if (!task) {
        throw new HttpException(
          {
            message: 'Task not found',
            code: ErrorCode.TASK_NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedTask = await this.tasksService.updateTaskStatus(
        _id,
        body.status,
      );
      return updatedTask;
    } catch (error) {
      if (error.status) throw error;
      this.logger.error(
        `Task status update request failed with error: ${error.stack}`,
      );
      throw new InternalServerErrorException();
    }
  }
}
