import { Test, TestingModule } from '@nestjs/testing';
import { VisoObjectController } from './viso-object.controller';
import { VisoObjectService } from './viso-object.service';
import { CreateVisoObjectDto } from './dto/create-viso-object.dto';
import { ResponseVisoObjectDto } from './dto/response-viso-object.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  AuthenticatedRequest,
  JwtPayload,
} from '../auth/types/jwt-payload.interface';

describe('VisoObjectController', () => {
  let controller: VisoObjectController;
  let service: jest.Mocked<VisoObjectService>;

  const mockUser: JwtPayload = {
    userId: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
  };

  const mockRequest: AuthenticatedRequest = {
    user: mockUser,
  } as AuthenticatedRequest;

  const mockVisoObject: ResponseVisoObjectDto = {
    _id: '507f1f77bcf86cd799439012',
    obj_macRede: '00:11:22:33:44:55',
    obj_name: 'Test Object',
    obj_status: 1,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
  };

  const mockCreateVisoObjectDto: CreateVisoObjectDto = {
    obj_networkMAC: '00:11:22:33:44:55',
    obj_name: 'Test Object',
    obj_model: 'Model X',
    obj_brand: 'Brand Y',
    obj_function: ['temperature_sensing', 'data_transmission'],
    obj_restriction: ['indoor_only'],
    obj_limitation: ['battery_powered'],
    obj_access: 5,
    obj_location: 101,
    obj_qualification: 85,
    obj_status: 1,
  };

  const mockVisoObjectService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisoObjectController],
      providers: [
        {
          provide: VisoObjectService,
          useValue: mockVisoObjectService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<VisoObjectController>(VisoObjectController);
    service = module.get<jest.Mocked<VisoObjectService>>(VisoObjectService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a viso object successfully', async () => {
      // Arrange
      service.create.mockResolvedValue(mockVisoObject);

      // Act
      const result = await controller.create(
        mockCreateVisoObjectDto,
        mockRequest,
      );

      // Assert
      expect(service.create).toHaveBeenCalledWith(
        mockCreateVisoObjectDto,
        mockUser,
      );
      expect(result).toEqual(mockVisoObject);
    });

    it('should throw error when service fails', async () => {
      // Arrange
      const error = new Error('Service error');
      service.create.mockRejectedValue(error);

      // Act & Assert
      await expect(
        controller.create(mockCreateVisoObjectDto, mockRequest),
      ).rejects.toThrow('Service error');
      expect(service.create).toHaveBeenCalledWith(
        mockCreateVisoObjectDto,
        mockUser,
      );
    });

    it('should pass user from request to service', async () => {
      // Arrange
      service.create.mockResolvedValue(mockVisoObject);

      // Act
      await controller.create(mockCreateVisoObjectDto, mockRequest);

      // Assert
      expect(service.create).toHaveBeenCalledWith(
        mockCreateVisoObjectDto,
        mockUser,
      );
    });
  });

  describe('findAll', () => {
    it('should return all viso objects', async () => {
      // Arrange
      const mockObjects = [mockVisoObject];
      service.findAll.mockResolvedValue(mockObjects);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockObjects);
    });

    it('should return empty array when no objects exist', async () => {
      // Arrange
      service.findAll.mockResolvedValue([]);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
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

  describe('findOne', () => {
    it('should return a single viso object by id', async () => {
      // Arrange
      const id = '507f1f77bcf86cd799439012';
      service.findOne.mockResolvedValue(mockVisoObject);

      // Act
      const result = await controller.findOne(id);

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockVisoObject);
    });

    it('should throw error when object is not found', async () => {
      // Arrange
      const id = 'nonexistent-id';
      const error = new Error('Object not found');
      service.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.findOne(id)).rejects.toThrow('Object not found');
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw error when service fails', async () => {
      // Arrange
      const id = '507f1f77bcf86cd799439012';
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
