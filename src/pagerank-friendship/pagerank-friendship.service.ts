import { Injectable } from '@nestjs/common';
import { CreatePagerankFriendshipDto } from './dto/create-pagerank-friendship.dto';
import { PageRankFriendship } from './schema/pagerank-friendship.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PagerankFriendshipService {
  constructor(
    @InjectModel(PageRankFriendship.name)
    private pagerankFriendshipModel: Model<PageRankFriendship>,
  ) {}

  create(createPagerankFriendshipDto: CreatePagerankFriendshipDto) {
    try {
      const pagerankFriendship = new this.pagerankFriendshipModel(
        createPagerankFriendshipDto,
      );
      const savedPagerankFriendship = pagerankFriendship.save();
      return savedPagerankFriendship;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to create pagerankFriendship: ${error.message}`,
        );
      }
      throw new Error(
        'Failed to create pagerankFriendship due to an unknown error',
      );
    }
  }

  async findAll() {
    try {
      const pagerankFriendships = await this.pagerankFriendshipModel.find();
      return pagerankFriendships;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find pagerankFriendship: ${error.message}`);
      }
      throw new Error(
        'Failed to find pagerankFriendship due to an unknown error',
      );
    }
  }

  async findOne(id: string) {
    try {
      const pagerankFriendship =
        await this.pagerankFriendshipModel.findById(id);

      if (!pagerankFriendship) {
        throw new Error(`pagerankFriendship with id ${id} not found`);
      }

      return pagerankFriendship;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find pagerankFriendship: ${error.message}`);
      }
      throw new Error(
        'Failed to find pagerankFriendship due to an unknown error',
      );
    }
  }
}
