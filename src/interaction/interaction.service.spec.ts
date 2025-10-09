/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InteractionService } from './interaction.service';
import { Interaction } from './schema/interaction.schema';
import { CreateInteractionDto } from './dto/create-interaction.dto';

describe('InteractionService', () => {
  let service: InteractionService;
  let model: Model<Interaction>;

  const mockInteraction = {
    _id: '507f1f77bcf86cd799439011',
    inter_obj_i: '507f1f77bcf86cd799439011',
    inter_obj_j: '507f1f77bcf86cd799439012',
    inter_start: new Date('2024-01-15T10:30:00.000Z'),
    inter_end: new Date('2024-01-15T10:35:00.000Z'),
    inter_feedback: true,
    inter_service: 1,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
  };

  const mockCreateInteractionDto: CreateInteractionDto = {
    inter_obj_i: '507f1f77bcf86cd799439011',
    inter_obj_j: '507f1f77bcf86cd799439012',
    inter_start: new Date('2024-01-15T10:30:00.000Z'),
    inter_end: new Date('2024-01-15T10:35:00.000Z'),
    inter_feedback: true,
    inter_service: 1,
  };

  beforeEach(async () => {
    const mockModel = jest.fn().mockImplementation(() => ({
      save: jest.fn(),
    }));

    // Adicionar métodos estáticos ao mock
    (mockModel as any).find = jest.fn();
    (mockModel as any).findById = jest.fn();
    (mockModel as any).aggregate = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InteractionService,
        {
          provide: getModelToken(Interaction.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<InteractionService>(InteractionService);
    model = module.get<Model<Interaction>>(getModelToken(Interaction.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save an interaction successfully', async () => {
      // Arrange
      const mockSave = jest.fn().mockResolvedValue(mockInteraction as any);
      (model as any).mockImplementation(() => ({
        save: mockSave,
      }));

      // Act
      const result = await service.create(mockCreateInteractionDto);

      // Assert
      expect(model).toHaveBeenCalledWith(mockCreateInteractionDto);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockInteraction);
    });

    it('should throw error when save fails', async () => {
      // Arrange
      const error = new Error('Database error');
      const mockSave = jest.fn().mockRejectedValue(error);
      (model as any).mockImplementation(() => ({
        save: mockSave,
      }));

      // Act & Assert
      await expect(service.create(mockCreateInteractionDto)).rejects.toThrow(
        'Failed to create interaction: Database error',
      );
    });

    it('should throw generic error for unknown errors', async () => {
      // Arrange
      const mockSave = jest.fn().mockRejectedValue(null); // null não é uma instância de Error
      (model as any).mockImplementation(() => ({
        save: mockSave,
      }));

      // Act & Assert
      await expect(service.create(mockCreateInteractionDto)).rejects.toThrow(
        'Failed to create interaction due to an unknown error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all interactions', async () => {
      // Arrange
      const mockInteractions = [mockInteraction];
      const mockExec = jest.fn().mockResolvedValue(mockInteractions);
      const mockLean = jest.fn().mockReturnValue({ exec: mockExec });

      model.find = jest.fn().mockReturnValue({ lean: mockLean });

      // Act
      const result = await service.findAll();

      // Assert
      expect(model.find).toHaveBeenCalled();
      expect(mockLean).toHaveBeenCalled();
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockInteractions);
    });

    it('should throw error when find fails', async () => {
      // Arrange
      const error = new Error('Database error');
      const mockExec = jest.fn().mockRejectedValue(error);
      const mockLean = jest.fn().mockReturnValue({ exec: mockExec });

      model.find = jest.fn().mockReturnValue({ lean: mockLean });

      // Act & Assert
      await expect(service.findAll()).rejects.toThrow(
        'Failed to find interaction: Database error',
      );
    });
  });

  describe('countInteractionsByDay', () => {
    it('should return interaction count by day for week period', async () => {
      // Arrange
      const mockResult = [
        { _id: '2024-01-01', total: 5 },
        { _id: '2024-01-02', total: 3 },
      ];

      model.aggregate = jest.fn().mockResolvedValue(mockResult);

      // Act
      const result = await service.countInteractionsByDay('week');

      // Assert
      expect(model.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            createdAt: { $gte: expect.any(Date) },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            total: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      expect(result).toEqual(mockResult);
    });

    it('should return interaction count by day for month period', async () => {
      // Arrange
      const mockResult = [
        { _id: '2024-01-01', total: 10 },
        { _id: '2024-01-02', total: 8 },
      ];

      model.aggregate = jest.fn().mockResolvedValue(mockResult);

      // Act
      const result = await service.countInteractionsByDay('month');

      // Assert
      expect(model.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should throw error when aggregation fails', async () => {
      // Arrange
      const error = new Error('Aggregation error');
      model.aggregate = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(service.countInteractionsByDay('week')).rejects.toThrow(
        'Failed to find interaction: Aggregation error',
      );
    });
  });

  describe('getTimeSeries', () => {
    it('should return time series data for 7 days', async () => {
      // Arrange
      const mockResult = [
        { date: '2024-01-01', interactions: 5 },
        { date: '2024-01-02', interactions: 3 },
      ];

      model.aggregate = jest.fn().mockResolvedValue(mockResult);

      // Act
      const result = await service.getTimeSeries('7d');

      // Assert
      expect(model.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            createdAt: { $gte: expect.any(Date) },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            interactions: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: '$_id',
            interactions: 1,
          },
        },
      ]);
      expect(result).toEqual(mockResult);
    });

    it('should return time series data for 30 days', async () => {
      // Arrange
      const mockResult = [
        { date: '2024-01-01', interactions: 15 },
        { date: '2024-01-02', interactions: 12 },
      ];

      model.aggregate = jest.fn().mockResolvedValue(mockResult);

      // Act
      const result = await service.getTimeSeries('30d');

      // Assert
      expect(model.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should throw error when time series aggregation fails', async () => {
      // Arrange
      const error = new Error('Time series error');
      model.aggregate = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(service.getTimeSeries('7d')).rejects.toThrow(
        'Failed to find interaction: Time series error',
      );
    });
  });

  describe('findOne', () => {
    it('should return a single interaction by id', async () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011';
      const mockExec = jest.fn().mockResolvedValue(mockInteraction as any);
      const mockLean = jest.fn().mockReturnValue({ exec: mockExec });

      model.findById = jest.fn().mockReturnValue({ lean: mockLean });

      // Act
      const result = await service.findOne(id);

      // Assert
      expect(model.findById).toHaveBeenCalledWith(id);
      expect(mockLean).toHaveBeenCalled();
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockInteraction);
    });

    it('should return null when interaction is not found', async () => {
      // Arrange
      const id = 'nonexistent-id';
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockLean = jest.fn().mockReturnValue({ exec: mockExec });

      model.findById = jest.fn().mockReturnValue({ lean: mockLean });

      // Act
      const result = await service.findOne(id);

      // Assert
      expect(model.findById).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });

    it('should throw error when findById fails', async () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011';
      const error = new Error('Database error');
      const mockExec = jest.fn().mockRejectedValue(error);
      const mockLean = jest.fn().mockReturnValue({ exec: mockExec });

      model.findById = jest.fn().mockReturnValue({ lean: mockLean });

      // Act & Assert
      await expect(service.findOne(id)).rejects.toThrow(
        'Failed to find interaction: Database error',
      );
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
