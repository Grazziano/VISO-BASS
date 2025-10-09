/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Test, TestingModule } from '@nestjs/testing';
import { PagerankFriendshipService } from './pagerank-friendship.service';
import { getModelToken } from '@nestjs/mongoose';
import { PageRankFriendship } from './schema/pagerank-friendship.schema';
import { CreatePagerankFriendshipDto } from './dto/create-pagerank-friendship.dto';

describe('PagerankFriendshipService', () => {
  let service: PagerankFriendshipService;
  let mockPagerankFriendshipModel: any;

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

  beforeEach(async () => {
    mockPagerankFriendshipModel = jest.fn().mockImplementation(() => ({
      save: jest.fn(),
    }));

    // Add static methods to the mock constructor
    (mockPagerankFriendshipModel as any).find = jest.fn();
    (mockPagerankFriendshipModel as any).findById = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagerankFriendshipService,
        {
          provide: getModelToken(PageRankFriendship.name),
          useValue: mockPagerankFriendshipModel,
        },
      ],
    }).compile();

    service = module.get<PagerankFriendshipService>(PagerankFriendshipService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      const mockSavedFriendship = {
        ...mockPageRankFriendship,
        save: jest.fn().mockResolvedValue(mockPageRankFriendship),
      };

      mockPagerankFriendshipModel.mockImplementation(() => mockSavedFriendship);

      const result = await service.create(createPagerankFriendshipDto);

      expect(mockSavedFriendship.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw Error when save fails', async () => {
      const mockSavedFriendship = {
        save: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      mockPagerankFriendshipModel.mockImplementation(() => mockSavedFriendship);

      await expect(service.create(createPagerankFriendshipDto)).rejects.toThrow(
        'Failed to create pagerankFriendship: Database error',
      );
    });

    it('should throw Error for unknown error', async () => {
      const mockSavedFriendship = {
        save: jest.fn().mockRejectedValue('Unknown error'),
      };

      mockPagerankFriendshipModel.mockImplementation(() => mockSavedFriendship);

      await expect(service.create(createPagerankFriendshipDto)).rejects.toThrow(
        'Failed to create pagerankFriendship due to an unknown error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all pagerank friendships', async () => {
      const mockFriendships = [
        mockPageRankFriendship,
        { ...mockPageRankFriendship, _id: '507f1f77bcf86cd799439014' },
      ];

      (mockPagerankFriendshipModel as any).find.mockResolvedValue(
        mockFriendships,
      );

      const result = await service.findAll();

      expect((mockPagerankFriendshipModel as any).find).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('should throw Error when find fails', async () => {
      (mockPagerankFriendshipModel as any).find.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findAll()).rejects.toThrow(
        'Failed to find pagerankFriendship: Database error',
      );
    });

    it('should throw Error for unknown error', async () => {
      (mockPagerankFriendshipModel as any).find.mockRejectedValue(
        'Unknown error',
      );

      await expect(service.findAll()).rejects.toThrow(
        'Failed to find pagerankFriendship due to an unknown error',
      );
    });
  });

  describe('findOne', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should return a pagerank friendship by id', async () => {
      (mockPagerankFriendshipModel as any).findById.mockResolvedValue(
        mockPageRankFriendship,
      );

      const result = await service.findOne(validId);

      expect(
        (mockPagerankFriendshipModel as any).findById,
      ).toHaveBeenCalledWith(validId);
      expect(result).toBeDefined();
      expect(result.rank_object).toBe(mockPageRankFriendship.rank_object);
    });

    it('should throw Error when friendship is not found', async () => {
      (mockPagerankFriendshipModel as any).findById.mockResolvedValue(null);

      await expect(service.findOne(validId)).rejects.toThrow(
        `pagerankFriendship with id ${validId} not found`,
      );
    });

    it('should throw Error when findById fails', async () => {
      (mockPagerankFriendshipModel as any).findById.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findOne(validId)).rejects.toThrow(
        'Failed to find pagerankFriendship: Database error',
      );
    });

    it('should throw Error for unknown error', async () => {
      (mockPagerankFriendshipModel as any).findById.mockRejectedValue(
        'Unknown error',
      );

      await expect(service.findOne(validId)).rejects.toThrow(
        'Failed to find pagerankFriendship due to an unknown error',
      );
    });
  });

  describe('findMostRelevant', () => {
    it('should return most relevant friendships sorted by relevance score', async () => {
      const mockFriendships = [
        { ...mockPageRankFriendship, rank_adjacency: ['user1'] },
        {
          ...mockPageRankFriendship,
          _id: '507f1f77bcf86cd799439014',
          rank_adjacency: ['user1', 'user2', 'user3'],
        },
        {
          ...mockPageRankFriendship,
          _id: '507f1f77bcf86cd799439015',
          rank_adjacency: ['user1', 'user2'],
        },
      ];

      (mockPagerankFriendshipModel as any).find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockFriendships),
      });

      const result = await service.findMostRelevant(2);

      expect((mockPagerankFriendshipModel as any).find).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].relevanceScore).toBe(3); // Most relevant first
      expect(result[1].relevanceScore).toBe(2);
    });

    it('should return empty array when no friendships exist', async () => {
      (mockPagerankFriendshipModel as any).find.mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      });

      const result = await service.findMostRelevant(5);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });
});
