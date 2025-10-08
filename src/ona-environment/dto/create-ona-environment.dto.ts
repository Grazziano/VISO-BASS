import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateOnaEnvironmentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'ID do objeto VISO central no ambiente ONA (formato ObjectId do MongoDB)',
    example: '507f1f77bcf86cd799439011',
    type: 'string',
    format: 'ObjectId',
  })
  env_object_i: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Número total de interações registradas no ambiente',
    example: 150,
    type: 'number',
    minimum: 0,
  })
  env_total_interactions: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Número total de interações válidas (com feedback positivo)',
    example: 120,
    type: 'number',
    minimum: 0,
  })
  env_total_valid: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Número de novas interações desde a última atualização',
    example: 25,
    type: 'number',
    minimum: 0,
  })
  env_total_new: number;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description:
      'Matriz de adjacência representando conexões entre objetos no ambiente',
    example: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ],
    type: 'array',
    items: {
      type: 'array',
      items: { type: 'number' },
    },
  })
  env_adjacency: number[][];

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Lista de IDs dos objetos VISO presentes no ambiente',
    example: [
      '507f1f77bcf86cd799439011',
      '507f1f77bcf86cd799439012',
      '507f1f77bcf86cd799439013',
    ],
    type: 'array',
    items: { type: 'string', format: 'ObjectId' },
  })
  objects: string[];
}
