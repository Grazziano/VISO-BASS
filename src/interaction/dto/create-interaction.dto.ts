import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInteractionDto {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Objeto 1 da interação',
    example: 0,
  })
  inter_obj_i: string;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Objeto 2 da interação',
    example: 0,
  })
  inter_obj_j: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Data de inicio da interação',
    example: '2023-01-01',
  })
  inter_start: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional() // caso inter_end possa ser nulo inicialmente
  @ApiProperty({
    description: 'Data de fim da interação',
    example: '2023-01-01',
  })
  inter_end: Date;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Feedback da interação',
    example: true,
  })
  inter_feedback: boolean;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Serviço da interação',
    example: 0,
  })
  inter_service: number;
}
