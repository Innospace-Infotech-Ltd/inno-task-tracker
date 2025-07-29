import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class PaginationDto {
  @IsOptional()
  @Type(() => Number) // Transform query string to number
  @IsPositive()
  @Min(1)
  page: number = 1; // Default to page 1

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  limit: number = 10; // Default to 10 items per page

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  total: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  totalPages: number;
}
