import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of items', example: 25 })
  total: number;

  @ApiProperty({ description: 'Total number of pages', example: 3 })
  totalPages: number;
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'HTTP status code', example: 400 })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2025-07-31T12:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path that caused the error',
    example: '/api/tasks',
  })
  path: string;

  @ApiProperty({ description: 'HTTP method used', example: 'POST' })
  method: string;

  @ApiProperty({ description: 'Error type', example: 'ValidationError' })
  error: string;

  @ApiProperty({
    description: 'Error message or validation errors',
    oneOf: [
      { type: 'string', example: 'Invalid input data' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['title must be a string', 'email must be a valid email'],
      },
    ],
  })
  message: string | string[];
}

export class SuccessResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Operation completed successfully',
  })
  message: string;

  @ApiProperty({ description: 'Status code', example: 200 })
  statusCode: number;
}
