import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTaskDto } from './dto/find-task.dto';
import { mongo } from 'mongoose';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() taskDto: CreateTaskDto) {
    try {
      return this.tasksService.create(taskDto);
    } catch (error: any) {
      throw new Error('Error creating task: ' + error.message);
    }
  }

  @Get()
  findAll(@Query() query: FindTaskDto) {
    return this.tasksService.findAll(query);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: mongo.ObjectId,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    return this.tasksService.updateStatus(id, updateTaskStatusDto.status);
  }
}
