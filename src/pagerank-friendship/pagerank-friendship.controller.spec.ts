import { Test, TestingModule } from '@nestjs/testing';
import { PagerankFriendshipController } from './pagerank-friendship.controller';
import { PagerankFriendshipService } from './pagerank-friendship.service';

describe('PagerankFriendshipController', () => {
  let controller: PagerankFriendshipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagerankFriendshipController],
      providers: [PagerankFriendshipService],
    }).compile();

    controller = module.get<PagerankFriendshipController>(
      PagerankFriendshipController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
