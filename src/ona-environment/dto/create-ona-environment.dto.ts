import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateOnaEnvironmentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Objeto 1 da interação' })
  env_object_i: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Total de interações' })
  env_total_interactions: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'Total de interações validas' })
  env_total_valid: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'Total de interações novas' })
  env_total_new: number;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ description: 'Matriz de adjacencia' })
  env_adjacency: number[][];

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ description: 'Objetos' })
  objects: string[];
}
