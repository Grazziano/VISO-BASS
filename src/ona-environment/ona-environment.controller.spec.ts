import { Test, TestingModule } from '@nestjs/testing';
import { OnaEnvironmentController } from './ona-environment.controller';
import { OnaEnvironmentService } from './ona-environment.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOnaEnvironmentDto } from './dto/create-ona-environment.dto';

describe('OnaEnvironmentController', () => {
  let controller: OnaEnvironmentController;

  const mockOnaEnvironment = {
    _id: '507f1f77bcf86cd799439011',
    env_object_i: '507f1f77bcf86cd799439011',
    env_total_interactions: 150,
    env_total_valid: 120,
    env_total_new: 25,
    env_adjacency: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ],
    objects: [
      '507f1f77bcf86cd799439011',
      '507f1f77bcf86cd799439012',
      '507f1f77bcf86cd799439013',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOnaEnvironmentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    countEnvironments: jest.fn(),
    countObjectsAggregation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnaEnvironmentController],
      providers: [
        {
          provide: OnaEnvironmentService,
          useValue: mockOnaEnvironmentService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<OnaEnvironmentController>(OnaEnvironmentController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createOnaEnvironmentDto: CreateOnaEnvironmentDto = {
      env_object_i: '507f1f77bcf86cd799439011',
      env_total_interactions: 150,
      env_total_valid: 120,
      env_total_new: 25,
      env_adjacency: [
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
      ],
      objects: [
        '507f1f77bcf86cd799439011',
        '507f1f77bcf86cd799439012',
        '507f1f77bcf86cd799439013',
      ],
    };

    it('should create an ona environment successfully', async () => {
      mockOnaEnvironmentService.create.mockResolvedValue(mockOnaEnvironment);

      const result = await controller.create(createOnaEnvironmentDto);

      expect(mockOnaEnvironmentService.create).toHaveBeenCalledWith(
        createOnaEnvironmentDto,
      );
      expect(result).toEqual(mockOnaEnvironment);
    });

    it('should throw Error when service fails', async () => {
      mockOnaEnvironmentService.create.mockRejectedValue(
        new Error('Failed to create onaEnvironment'),
      );

      await expect(controller.create(createOnaEnvironmentDto)).rejects.toThrow(
        'Failed to create onaEnvironment',
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated ona environments', async () => {
      const mockResult = {
        items: [
          mockOnaEnvironment,
          { ...mockOnaEnvironment, _id: '507f1f77bcf86cd799439014' },
        ],
        total: 2,
        page: 1,
        limit: 10,
      };
      mockOnaEnvironmentService.findAll.mockResolvedValue(mockResult as any);

      const result = await controller.findAll();

      expect(mockOnaEnvironmentService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.total).toBe(2);
    });

    it('should throw Error when service fails', async () => {
      mockOnaEnvironmentService.findAll.mockRejectedValue(
        new Error('Failed to find onaEnvironment'),
      );

      await expect(controller.findAll()).rejects.toThrow(
        'Failed to find onaEnvironment',
      );
    });
  });

  describe('count', () => {
    it('should return total environments', async () => {
      const mockCount = { total: 5 };
      mockOnaEnvironmentService.countEnvironments.mockResolvedValue(mockCount);

      const result = await controller.countEnvironments();

      expect(mockOnaEnvironmentService.countEnvironments).toHaveBeenCalled();
      expect(result).toEqual(mockCount);
    });
  });

  describe('objects-count', () => {
    it('should return aggregated objects count for all environments', async () => {
      const mockAgg = {
        environments: [
          { environmentId: '507f1f77bcf86cd799439011', objectsCount: 3 },
        ],
        totalObjects: 3,
      };
      mockOnaEnvironmentService.countObjectsAggregation.mockResolvedValue(
        mockAgg,
      );

      const result = await controller.getObjectsCount();

      expect(
        mockOnaEnvironmentService.countObjectsAggregation,
      ).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockAgg);
    });

    it('should accept environmentId filter', async () => {
      const mockAgg = {
        environments: [
          { environmentId: '507f1f77bcf86cd799439011', objectsCount: 3 },
        ],
        totalObjects: 3,
      };
      mockOnaEnvironmentService.countObjectsAggregation.mockResolvedValue(
        mockAgg,
      );

      const result = await controller.getObjectsCount(
        '507f1f77bcf86cd799439011',
      );

      expect(
        mockOnaEnvironmentService.countObjectsAggregation,
      ).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockAgg);
    });
  });

  describe('findOne', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should return an ona environment by id', async () => {
      mockOnaEnvironmentService.findOne.mockResolvedValue(mockOnaEnvironment);

      const result = await controller.findOne(validId);

      expect(mockOnaEnvironmentService.findOne).toHaveBeenCalledWith(validId);
      expect(result).toEqual(mockOnaEnvironment);
    });

    it('should throw Error when environment is not found', async () => {
      mockOnaEnvironmentService.findOne.mockRejectedValue(
        new Error(`onaEnvironment with id ${validId} not found`),
      );

      await expect(controller.findOne(validId)).rejects.toThrow(
        `onaEnvironment with id ${validId} not found`,
      );
    });

    it('should throw Error when service fails', async () => {
      mockOnaEnvironmentService.findOne.mockRejectedValue(
        new Error('Failed to find onaEnvironment'),
      );

      await expect(controller.findOne(validId)).rejects.toThrow(
        'Failed to find onaEnvironment',
      );
    });
  });
});
