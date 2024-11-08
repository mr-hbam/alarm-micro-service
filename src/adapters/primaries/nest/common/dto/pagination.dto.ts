import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { toNumber } from '../helper/cast.helper';

export class PaginationDto {
  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  skip: number;

  @Transform(({ value }) => toNumber(value, { min: 1, max: 100 }))
  @IsOptional()
  @IsNumber()
  limit: number;

  constructor() {
    this.skip = 0;
    this.limit = 100;
  }
}
