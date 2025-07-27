import { Injectable } from '@nestjs/common';
import { CreatePagerankFriendshipDto } from './dto/create-pagerank-friendship.dto';
import { UpdatePagerankFriendshipDto } from './dto/update-pagerank-friendship.dto';
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

  findAll() {
    return `This action returns all pagerankFriendship`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pagerankFriendship`;
  }

  update(id: number, updatePagerankFriendshipDto: UpdatePagerankFriendshipDto) {
    console.log(updatePagerankFriendshipDto);
    return `This action updates a #${id} pagerankFriendship`;
  }

  remove(id: number) {
    return `This action removes a #${id} pagerankFriendship`;
  }
}
