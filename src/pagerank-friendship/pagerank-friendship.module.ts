import { Module } from '@nestjs/common';
import { PagerankFriendshipService } from './pagerank-friendship.service';
import { PagerankFriendshipController } from './pagerank-friendship.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PageRankFriendship,
  PageRankFriendshipSchema,
} from './schema/pagerank-friendship.schema';
import { VisoObjectModule } from '../viso-object/viso-object.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PageRankFriendship.name, schema: PageRankFriendshipSchema },
    ]),
    VisoObjectModule,
  ],
  controllers: [PagerankFriendshipController],
  providers: [PagerankFriendshipService],
})
export class PagerankFriendshipModule {}
