import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreatePagerankFriendshipDto {
  @IsString()
  @ApiProperty({
    description:
      'ID do objeto VISO para o qual será calculado o PageRank (formato ObjectId do MongoDB)',
    example: '507f1f77bcf86cd799439011',
    type: 'string',
    format: 'ObjectId',
  })
  rank_object: string;

  @IsArray()
  @ApiProperty({
    description:
      'Lista de IDs dos objetos adjacentes/conectados para cálculo do PageRank',
    example: [
      '507f1f77bcf86cd799439012',
      '507f1f77bcf86cd799439013',
      '507f1f77bcf86cd799439014',
    ],
    type: 'array',
    items: { type: 'string', format: 'ObjectId' },
  })
  rank_adjacency: string[];
}
