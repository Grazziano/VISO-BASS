/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Test, TestingModule } from '@nestjs/testing';
import { InteractionController } from './interaction.controller';
import { InteractionService } from './interaction.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { AuthGuard } from '@nestjs/passport';

describe('InteractionController', () => {
  let controller: InteractionController;
  let service: jest.Mocked<InteractionService>;

  const mockInteraction = {
    _id: '507f1f77bcf86cd799439011',
    inter_obj_i: 'object1',
    inter_obj_j: 'object2',
    inter_start: new Date('2024-01-01T10:00:00Z'),
    inter_end: new Date('2024-01-01T11:00:00Z'),
    inter_feedback: true,
    inter_service: 1,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
  };

  const mockCreateInteractionDto: CreateInteractionDto = {
    inter_obj_i: 'object1',
    inter_obj_j: 'object2',
    inter_start: new Date('2024-01-01T10:00:00Z'),
    inter_end: new Date('2024-01-01T11:00:00Z'),
    inter_feedback: true,
    inter_service: 1,
  };

  const mockInteractionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    countInteractionsByDay: jest.fn(),
    getTimeSeries: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteractionController],
      providers: [
        {
          provide: InteractionService,
          useValue: mockInteractionService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<InteractionController>(InteractionController);
    service = module.get<jest.Mocked<InteractionService>>(
      InteractionService,
    ) as jest.Mocked<InteractionService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an interaction successfully', async () => {
      // Arrange
      service.create.mockResolvedValue(mockInteraction as any);

      // Act
      const result = await controller.create(mockCreateInteractionDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(mockCreateInteractionDto);
      expect(result).toEqual(mockInteraction);
    });

    it('should throw error when service fails', async () => {
      // Arrange
      const error = new Error('Service error');
      service.create.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.create(mockCreateInteractionDto)).rejects.toThrow(
        'Service error',
      );
      expect(service.create).toHaveBeenCalledWith(mockCreateInteractionDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated interactions', async () => {
      // Arrange
      const mockResult = {
        items: [mockInteraction],
        total: 1,
        page: 1,
        limit: 10,
      };
      service.findAll.mockResolvedValue(mockResult as any);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.total).toBe(1);
    });

    it('should return empty items when no interactions exist', async () => {
      // Arrange
      const mockResult = { items: [], total: 0, page: 1, limit: 10 };
      service.findAll.mockResolvedValue(mockResult as any);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should throw error when service fails', async () => {
      // Arrange
      const error = new Error('Service error');
      service.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.findAll()).rejects.toThrow('Service error');
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('countByDay', () => {
    it('should return interaction count by day for week period', async () => {
      // Arrange
      const mockResult = [
        { _id: '2024-01-01', total: 5 },
        { _id: '2024-01-02', total: 3 },
      ];
      service.countInteractionsByDay.mockResolvedValue(mockResult);

      // Act
      const result = await controller.countByDay('week');

      // Assert
      expect(service.countInteractionsByDay).toHaveBeenCalledWith('week');
      expect(result).toEqual(mockResult);
    });

    it('should return interaction count by day for month period', async () => {
      // Arrange
      const mockResult = [
        { _id: '2024-01-01', total: 10 },
        { _id: '2024-01-02', total: 8 },
      ];
      service.countInteractionsByDay.mockResolvedValue(mockResult);

      // Act
      const result = await controller.countByDay('month');

      // Assert
      expect(service.countInteractionsByDay).toHaveBeenCalledWith('month');
      expect(result).toEqual(mockResult);
    });

    it('should use default period when not specified', async () => {
      // Arrange
      const mockResult = [{ _id: '2024-01-01', total: 5 }];
      service.countInteractionsByDay.mockResolvedValue(mockResult);

      // Act
      const result = await controller.countByDay();

      // Assert
      expect(service.countInteractionsByDay).toHaveBeenCalledWith('week');
      expect(result).toEqual(mockResult);
    });

    it('should throw error when service fails', async () => {
      // Arrange
      const error = new Error('Service error');
      service.countInteractionsByDay.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.countByDay('week')).rejects.toThrow(
        'Service error',
      );
      expect(service.countInteractionsByDay).toHaveBeenCalledWith('week');
    });
  });

  describe('getInteractionsTimeSeries', () => {
    it('should return time series data for 7 days', async () => {
      // Arrange
      const mockResult = [
        { date: '2024-01-01', interactions: 5 },
        { date: '2024-01-02', interactions: 3 },
      ];
      service.getTimeSeries.mockResolvedValue(mockResult);

      // Act
      const result = await controller.getInteractionsTimeSeries('7d');

      // Assert
      expect(service.getTimeSeries).toHaveBeenCalledWith('7d');
      expect(result).toEqual(mockResult);
    });

    it('should return time series data for 30 days', async () => {
      // Arrange
      const mockResult = [
        { date: '2024-01-01', interactions: 15 },
        { date: '2024-01-02', interactions: 12 },
      ];
      service.getTimeSeries.mockResolvedValue(mockResult);

      // Act
      const result = await controller.getInteractionsTimeSeries('30d');

      // Assert
      expect(service.getTimeSeries).toHaveBeenCalledWith('30d');
      expect(result).toEqual(mockResult);
    });

    it('should use default range when not specified', async () => {
      // Arrange
      const mockResult = [{ date: '2024-01-01', interactions: 5 }];
      service.getTimeSeries.mockResolvedValue(mockResult);

      // Act
      const result = await controller.getInteractionsTimeSeries();

      // Assert
      expect(service.getTimeSeries).toHaveBeenCalledWith('7d');
      expect(result).toEqual(mockResult);
    });

    it('should throw error when service fails', async () => {
      // Arrange
      const error = new Error('Service error');
      service.getTimeSeries.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getInteractionsTimeSeries('7d')).rejects.toThrow(
        'Service error',
      );
      expect(service.getTimeSeries).toHaveBeenCalledWith('7d');
    });
  });

  describe('findOne', () => {
    it('should return a single interaction by id', async () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011';
      service.findOne.mockResolvedValue(mockInteraction as any);

      // Act
      const result = await controller.findOne(id);

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockInteraction);
    });

    it('should return null when interaction is not found', async () => {
      // Arrange
      const id = 'nonexistent-id';
      service.findOne.mockResolvedValue(null);

      // Act
      const result = await controller.findOne(id);

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });

    it('should throw error when service fails', async () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011';
      const error = new Error('Service error');
      service.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.findOne(id)).rejects.toThrow('Service error');
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
