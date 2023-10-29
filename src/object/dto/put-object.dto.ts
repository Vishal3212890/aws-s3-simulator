import { IsNotEmpty } from 'class-validator';

export class PutObjectDto {
  @IsNotEmpty()
  key: string;
}
