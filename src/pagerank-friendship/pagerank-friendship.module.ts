import { Module } from '@nestjs/common';
import { PagerankFriendshipService } from './pagerank-friendship.service';
import { PagerankFriendshipController } from './pagerank-friendship.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PageRankFriendship,
  PageRankFriendshipSchema,
} from './schema/pagerank-friendship.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PageRankFriendship.name, schema: PageRankFriendshipSchema },
    ]),
  ],
  controllers: [PagerankFriendshipController],
  providers: [PagerankFriendshipService],
})
export class PagerankFriendshipModule {}
