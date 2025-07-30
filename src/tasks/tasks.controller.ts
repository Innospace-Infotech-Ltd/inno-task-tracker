import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { IdParamDto } from '../common/dto/id-param.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Task } from './schemas/task.schema';
import { PaginatedTasksResponseDto } from './dto/paginated-tasks-response.dto';
import { NOT_FOUND_RESPONSE_EXAMPLE } from './example-objects/not-found-response.example';
import { BAD_REQUEST_RESPONSE_EXAMPLE } from './example-objects/bad-req-response.example';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiOkResponse({
    description: 'The task has been successfully created.',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: BAD_REQUEST_RESPONSE_EXAMPLE,
    },
  })
  @Post()
  async create(@Body(ValidationPipe) dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @ApiOperation({ summary: 'List tasks' })
  @ApiOkResponse({
    description: 'Get All Tasks with filters and pagination',
    type: PaginatedTasksResponseDto,
  })
  @Get()
  async list(@Query(ValidationPipe) q: GetTasksQueryDto) {
    return this.tasksService.getTasks(q);
  }

  @ApiOperation({ summary: 'Update task status' })
  @ApiOkResponse({
    description: 'The task status has been successfully updated.',
    type: Task,
  })
  @ApiNotFoundResponse({
    description: 'Task not found.',
    schema: {
      example: NOT_FOUND_RESPONSE_EXAMPLE,
    },
  })
  @Patch(':id/status')
  async update(
    @Param(ValidationPipe) { id }: IdParamDto,
    @Body(ValidationPipe) dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, dto);
  }
}
