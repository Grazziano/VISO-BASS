import { IsArray, IsString } from 'class-validator';

export class CreatePagerankFriendshipDto {
  @IsString()
  rank_object: string;

  @IsArray()
  rank_adjacency: string[];
}
