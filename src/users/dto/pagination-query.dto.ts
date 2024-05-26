import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @IsInt()
  limit?: number = 10;
}