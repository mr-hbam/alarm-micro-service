import { IsOptional, IsString } from 'class-validator';

export class KeyWordDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}
