import { Test, TestingModule } from '@nestjs/testing';
import { PagerankFriendshipService } from './pagerank-friendship.service';

describe('PagerankFriendshipService', () => {
  let service: PagerankFriendshipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PagerankFriendshipService],
    }).compile();

    service = module.get<PagerankFriendshipService>(PagerankFriendshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
