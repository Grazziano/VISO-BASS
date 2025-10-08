import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVisoClassDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nome identificador da classe VISO',
    example: 'Sensores de Ambiente',
    type: 'string',
    minLength: 1,
    maxLength: 100,
  })
  class_name: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Lista de funcionalidades comuns aos objetos desta classe',
    example: [
      'temperature_monitoring',
      'humidity_sensing',
      'air_quality_detection',
    ],
    type: 'array',
    items: { type: 'string' },
  })
  class_function: string[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Lista de IDs dos objetos VISO que pertencem a esta classe',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: 'array',
    items: { type: 'string', format: 'ObjectId' },
  })
  objects: string[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'Data de criação da classe (preenchida automaticamente)',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description:
      'Data da última atualização da classe (preenchida automaticamente)',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  updatedAt?: Date;
}
