import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreatePagerankFriendshipDto {
  @IsString()
  @ApiProperty({ description: 'Rank object' })
  rank_object: string;

  @IsArray()
  @ApiProperty({ description: 'Rank adjacency' })
  rank_adjacency: string[];
}
