import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiPropertyOptional({
    description: 'The page number',
    example: 1,
  })
  page: number;

  @ApiPropertyOptional({
    description: 'The number of items per page',
    example: 10,
  })
  limit: number;

  @ApiPropertyOptional({
    description: 'The total number of items',
    example: 100,
  })
  total: number;

  @ApiPropertyOptional({
    description: 'The total number of pages',
    example: 10,
  })
  totalPages: number;
}

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'The page number',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number) // Transform query string to number
  @IsPositive()
  @Min(1)
  page: number = 1; // Default to page 1

  @ApiPropertyOptional({
    description: 'The number of items per page',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  limit: number = 10; // Default to 10 items per page

  @ApiPropertyOptional({
    description: 'The total number of items',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  total: number;

  @ApiPropertyOptional({
    description: 'The total number of pages',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  totalPages: number;
}
