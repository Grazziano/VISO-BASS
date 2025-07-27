import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateOnaEnvironmentDto {
  @IsNotEmpty()
  @IsString()
  env_object_i: string;

  @IsNotEmpty()
  env_total_interactions: number;

  @IsNotEmpty()
  env_total_valid: number;

  @IsNotEmpty()
  env_total_new: number;

  @IsNotEmpty()
  @IsArray()
  env_adjacency: number[][];

  @IsNotEmpty()
  @IsArray()
  objects: string[];
}
