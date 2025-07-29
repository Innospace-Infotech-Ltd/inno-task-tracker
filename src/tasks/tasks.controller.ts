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
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { TaskQueryDto } from './dto/task-query.dto';

@Controller('tasks')
export class TasksController {
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

  @Patch(':id/status') update(@Param('id') _id: string, @Body() _dto: any) {
    this.notImpl();
  }
}
