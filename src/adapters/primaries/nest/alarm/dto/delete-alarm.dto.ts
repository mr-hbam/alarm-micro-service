import { IsString } from 'class-validator';

export class DeleteRequestDto {
  @IsString()
  key!: string;
}
