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
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { IdParamDto } from '../common/dto/id-param.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  private notImpl() {
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  @Post()
  async create(@Body(ValidationPipe) dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  async list(@Query(ValidationPipe) q: GetTasksQueryDto) {
    return this.tasksService.getTasks(q);
  }

  @Patch(':id/status')
  async update(
    @Param(ValidationPipe) { id }: IdParamDto,
    @Body(ValidationPipe) dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, dto);
  }
}
