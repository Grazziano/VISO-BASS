/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Test, TestingModule } from '@nestjs/testing';
import { OnaEnvironmentService } from './ona-environment.service';
import { getModelToken } from '@nestjs/mongoose';
import { OnaEnvironment } from './schema/ona-enviroment.schema';
import { CreateOnaEnvironmentDto } from './dto/create-ona-environment.dto';

describe('OnaEnvironmentService', () => {
  let service: OnaEnvironmentService;
  let mockOnaEnvironmentModel: any;

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

  beforeEach(async () => {
    mockOnaEnvironmentModel = jest.fn().mockImplementation(() => ({
      save: jest.fn(),
    }));
    (mockOnaEnvironmentModel as any).find = jest.fn();
    (mockOnaEnvironmentModel as any).findById = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OnaEnvironmentService,
        {
          provide: getModelToken(OnaEnvironment.name),
          useValue: mockOnaEnvironmentModel,
        },
      ],
    }).compile();

    service = module.get<OnaEnvironmentService>(OnaEnvironmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      const mockSavedEnvironment = {
        ...mockOnaEnvironment,
      };

      const mockSave = jest.fn().mockResolvedValue(mockSavedEnvironment);
      mockOnaEnvironmentModel.mockImplementation(() => ({
        save: mockSave,
      }));

      const result = await service.create(createOnaEnvironmentDto);

      expect(mockSave).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw Error when save fails', async () => {
      const mockSave = jest.fn().mockRejectedValue(new Error('Database error'));
      mockOnaEnvironmentModel.mockImplementation(() => ({
        save: mockSave,
      }));

      await expect(service.create(createOnaEnvironmentDto)).rejects.toThrow(
        'Failed to create onaEnvironment: Database error',
      );
    });

    it('should throw Error for unknown error', async () => {
      const mockSave = jest.fn().mockRejectedValue('Unknown error');
      mockOnaEnvironmentModel.mockImplementation(() => ({
        save: mockSave,
      }));

      await expect(service.create(createOnaEnvironmentDto)).rejects.toThrow(
        'Failed to create onaEnvironment due to an unknown error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all ona environments', async () => {
      const mockEnvironments = [
        mockOnaEnvironment,
        { ...mockOnaEnvironment, _id: '507f1f77bcf86cd799439014' },
      ];

      mockOnaEnvironmentModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockEnvironments),
        }),
      });

      const result = await service.findAll();

      expect(mockOnaEnvironmentModel.find).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('should throw Error when find fails', async () => {
      mockOnaEnvironmentModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      await expect(service.findAll()).rejects.toThrow(
        'Failed to find onaEnvironment: Database error',
      );
    });

    it('should throw Error for unknown error', async () => {
      mockOnaEnvironmentModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue('Unknown error'),
        }),
      });

      await expect(service.findAll()).rejects.toThrow(
        'Failed to find onaEnvironment due to an unknown error',
      );
    });
  });

  describe('findOne', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should return an ona environment by id', async () => {
      mockOnaEnvironmentModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockOnaEnvironment),
        }),
      });

      const result = await service.findOne(validId);

      expect(mockOnaEnvironmentModel.findById).toHaveBeenCalledWith(validId);
      expect(result).toBeDefined();
      expect(result.env_object_i).toBe(mockOnaEnvironment.env_object_i);
    });

    it('should throw Error when environment is not found', async () => {
      mockOnaEnvironmentModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.findOne(validId)).rejects.toThrow(
        `onaEnvironment with id ${validId} not found`,
      );
    });

    it('should throw Error when findById fails', async () => {
      mockOnaEnvironmentModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      await expect(service.findOne(validId)).rejects.toThrow(
        'Failed to find onaEnvironment: Database error',
      );
    });

    it('should throw Error for unknown error', async () => {
      mockOnaEnvironmentModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue('Unknown error'),
        }),
      });

      await expect(service.findOne(validId)).rejects.toThrow(
        'Failed to find onaEnvironment due to an unknown error',
      );
    });
  });
});
