import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMyClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}
