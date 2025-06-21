import { Injectable } from '@nestjs/common';
import { CreatePagerankFriendshipDto } from './dto/create-pagerank-friendship.dto';
import { UpdatePagerankFriendshipDto } from './dto/update-pagerank-friendship.dto';

@Injectable()
export class PagerankFriendshipService {
  create(createPagerankFriendshipDto: CreatePagerankFriendshipDto) {
    return 'This action adds a new pagerankFriendship';
  }

  findAll() {
    return `This action returns all pagerankFriendship`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pagerankFriendship`;
  }

  update(id: number, updatePagerankFriendshipDto: UpdatePagerankFriendshipDto) {
    return `This action updates a #${id} pagerankFriendship`;
  }

  remove(id: number) {
    return `This action removes a #${id} pagerankFriendship`;
  }
}
