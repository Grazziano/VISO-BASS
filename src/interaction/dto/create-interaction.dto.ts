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
  // @IsInt()
  // @Min(0)
  @IsNotEmpty()
  @ApiProperty({
    description:
      'ID do primeiro objeto VISO participante da interação (formato ObjectId do MongoDB)',
    example: '507f1f77bcf86cd799439011',
    type: 'string',
    format: 'ObjectId',
  })
  inter_obj_i: string;

  // @IsInt()
  // @Min(0)
  @IsNotEmpty()
  @ApiProperty({
    description:
      'ID do segundo objeto VISO participante da interação (formato ObjectId do MongoDB)',
    example: '507f1f77bcf86cd799439012',
    type: 'string',
    format: 'ObjectId',
  })
  inter_obj_j: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Data e hora de início da interação entre os objetos',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  inter_start: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional() // caso inter_end possa ser nulo inicialmente
  @ApiProperty({
    description: 'Data e hora de término da interação entre os objetos',
    example: '2024-01-15T10:35:00.000Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  inter_end: Date;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Feedback da interação: true para sucesso, false para falha ou problema',
    example: true,
    type: 'boolean',
  })
  inter_feedback: boolean;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Identificador do tipo de serviço ou protocolo utilizado na interação',
    example: 1,
    type: 'number',
    minimum: 0,
  })
  inter_service: number;
}
