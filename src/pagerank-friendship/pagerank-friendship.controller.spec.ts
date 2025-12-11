import { Test, TestingModule } from '@nestjs/testing';
import { PagerankFriendshipController } from './pagerank-friendship.controller';
import { PagerankFriendshipService } from './pagerank-friendship.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePagerankFriendshipDto } from './dto/create-pagerank-friendship.dto';

describe('PagerankFriendshipController', () => {
  let controller: PagerankFriendshipController;
  let service: PagerankFriendshipService;

  const mockPageRankFriendship = {
    _id: '507f1f77bcf86cd799439011',
    rank_object: '507f1f77bcf86cd799439011',
    rank_adjacency: [
      '507f1f77bcf86cd799439012',
      '507f1f77bcf86cd799439013',
      '507f1f77bcf86cd799439014',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPagerankFriendshipService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findMostRelevant: jest.fn(),
    countFriendships: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagerankFriendshipController],
      providers: [
        {
          provide: PagerankFriendshipService,
          useValue: mockPagerankFriendshipService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PagerankFriendshipController>(
      PagerankFriendshipController,
    );
    service = module.get<PagerankFriendshipService>(PagerankFriendshipService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createPagerankFriendshipDto: CreatePagerankFriendshipDto = {
      rank_object: '507f1f77bcf86cd799439011',
      rank_adjacency: [
        '507f1f77bcf86cd799439012',
        '507f1f77bcf86cd799439013',
        '507f1f77bcf86cd799439014',
      ],
    };

    it('should create a pagerank friendship successfully', async () => {
      mockPagerankFriendshipService.create.mockResolvedValue(
        mockPageRankFriendship,
      );

      const result = await controller.create(createPagerankFriendshipDto);

      expect(service.create).toHaveBeenCalledWith(createPagerankFriendshipDto);
      expect(result).toEqual(mockPageRankFriendship);
    });

    it('should throw Error when service fails', async () => {
      mockPagerankFriendshipService.create.mockRejectedValue(
        new Error('Failed to create pagerankFriendship'),
      );

      await expect(
        controller.create(createPagerankFriendshipDto),
      ).rejects.toThrow('Failed to create pagerankFriendship');
    });
  });

  describe('findAll', () => {
    it('should return paginated pagerank friendships', async () => {
      const mockResult = {
        items: [
          mockPageRankFriendship,
          { ...mockPageRankFriendship, _id: '507f1f77bcf86cd799439014' },
        ],
        total: 2,
        page: 1,
        limit: 10,
      };
      mockPagerankFriendshipService.findAll.mockResolvedValue(
        mockResult as any,
      );

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.total).toBe(2);
    });

    it('should throw Error when service fails', async () => {
      mockPagerankFriendshipService.findAll.mockRejectedValue(
        new Error('Failed to find pagerankFriendship'),
      );

      await expect(controller.findAll()).rejects.toThrow(
        'Failed to find pagerankFriendship',
      );
    });
  });

  describe('getRelevant', () => {
    it('should return most relevant friendships with default limit', async () => {
      const mockRelevantFriendships = [
        { ...mockPageRankFriendship, relevanceScore: 3 },
        {
          ...mockPageRankFriendship,
          _id: '507f1f77bcf86cd799439014',
          relevanceScore: 2,
        },
      ];
      mockPagerankFriendshipService.findMostRelevant.mockResolvedValue(
        mockRelevantFriendships,
      );

      const result = await controller.getRelevant();

      expect(service.findMostRelevant).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockRelevantFriendships);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('should return most relevant friendships with custom limit', async () => {
      const mockRelevantFriendships = [
        { ...mockPageRankFriendship, relevanceScore: 3 },
      ];
      mockPagerankFriendshipService.findMostRelevant.mockResolvedValue(
        mockRelevantFriendships,
      );

      const result = await controller.getRelevant(5);

      expect(service.findMostRelevant).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockRelevantFriendships);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
    });

    it('should throw Error when service fails', async () => {
      mockPagerankFriendshipService.findMostRelevant.mockRejectedValue(
        new Error('Failed to find relevant friendships'),
      );

      await expect(controller.getRelevant()).rejects.toThrow(
        'Failed to find relevant friendships',
      );
    });
  });

  describe('count', () => {
    it('should return total friendships (sum of adjacencies)', async () => {
      const mockCount = { total: 7 };
      mockPagerankFriendshipService.countFriendships.mockResolvedValue(
        mockCount,
      );

      const controllerResult = await controller.countEnvironments();

      expect(mockPagerankFriendshipService.countFriendships).toHaveBeenCalled();
      expect(controllerResult).toEqual(mockCount);
    });
  });

  describe('findOne', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should return a pagerank friendship by id', async () => {
      mockPagerankFriendshipService.findOne.mockResolvedValue(
        mockPageRankFriendship,
      );

      const result = await controller.findOne(validId);

      expect(service.findOne).toHaveBeenCalledWith(validId);
      expect(result).toEqual(mockPageRankFriendship);
    });

    it('should throw Error when friendship is not found', async () => {
      mockPagerankFriendshipService.findOne.mockRejectedValue(
        new Error(`pagerankFriendship with id ${validId} not found`),
      );

      await expect(controller.findOne(validId)).rejects.toThrow(
        `pagerankFriendship with id ${validId} not found`,
      );
    });

    it('should throw Error when service fails', async () => {
      mockPagerankFriendshipService.findOne.mockRejectedValue(
        new Error('Failed to find pagerankFriendship'),
      );

      await expect(controller.findOne(validId)).rejects.toThrow(
        'Failed to find pagerankFriendship',
      );
    });
  });
});
