import { PartialType } from '@nestjs/mapped-types';
import { CreatePagerankFriendshipDto } from './create-pagerank-friendship.dto';

export class UpdatePagerankFriendshipDto extends PartialType(
  CreatePagerankFriendshipDto,
) {}
