import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ErrorCode } from 'src/@types/error.types';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() taskData: CreateTaskDto) {
    try {
      const createdTask = await this.tasksService.createTask(taskData);
      return createdTask;
    } catch (error) {
      if (error.status) throw error;
      this.logger.error(
        `[POST /tasks] Task creation failed with ${error.message}`,
        error.stack,
        TasksController.name,
      );
      throw new InternalServerErrorException();
    }
  }

  @Get()
  async getTasks(@Query() query: TaskQueryDto) {
    try {
      this.logger.log(
        `[GET /tasks] Start fetching task list with filters: ${JSON.stringify(query)}`,
        TasksController.name,
      );

      const tasks = await this.tasksService.getTasks(query);

      this.logger.log(
        `[GET /tasks] Successfully fetched ${tasks?.meta?.total} tasks.`,
        TasksController.name,
      );

      return tasks;
    } catch (error) {
      if (error.status) throw error;
      console.log(error.stack);
      this.logger.error(
        `[GET /tasks] Failed to fetch task list. Error: ${error?.message}`,
        error.stack,
        TasksController.name,
      );
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id/status')
  async updateTask(
    @Param('id') _id: string,
    @Body() body: UpdateTaskStatusDto,
  ) {
    try {
      this.logger.log(
        `[PATCH /tasks/${_id}/status] Got request to update task status for ID: ${_id}`,
        TasksController.name,
      );

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
        `[PATCH /tasks/${_id}/status] Task status update request failed. Error: ${error.message}`,
        error.stack,
        TasksController.name,
      );

      throw new InternalServerErrorException();
    }
  }
}
