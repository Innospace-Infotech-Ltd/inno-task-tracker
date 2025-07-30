import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../schemas/task.schema';
import { PaginationMeta } from '../../common/dto/pagination.dto';

export class PaginatedTasksResponseDto {
  @ApiProperty({ type: [Task] })
  data: Task[];

  @ApiProperty({
    type: PaginationMeta,
    example: { page: 1, limit: 10, total: 20, totalPages: 2 },
  })
  meta: PaginationMeta;
}
