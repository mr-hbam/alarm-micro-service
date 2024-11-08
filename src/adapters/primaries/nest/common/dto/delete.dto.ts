import { ArrayMinSize, IsArray, IsMongoId } from 'class-validator';

export class DeleteRequestDto {
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  key: string;
}
