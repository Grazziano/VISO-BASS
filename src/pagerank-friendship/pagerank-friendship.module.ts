import { Module } from '@nestjs/common';
import { PagerankFriendshipService } from './pagerank-friendship.service';
import { PagerankFriendshipController } from './pagerank-friendship.controller';

@Module({
  controllers: [PagerankFriendshipController],
  providers: [PagerankFriendshipService],
})
export class PagerankFriendshipModule {}
