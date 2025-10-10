import { Test, TestingModule } from '@nestjs/testing';
import { MyClassController } from './viso-class.controller';
import { VisoClassService } from './viso-class.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateVisoClassDto } from './dto/create-viso-class.dto';
import { VisoClassResponseDto } from './dto/viso-class-response.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('MyClassController', () => {
  let controller: MyClassController;
  let service: VisoClassService;

  const mockVisoClassResponseDto: VisoClassResponseDto = {
    id: '507f1f77bcf86cd799439011',
    class_name: 'Test Class',
    class_function: ['temperature_monitoring', 'humidity_sensing'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockVisoClassService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyClassController],
      providers: [
        {
          provide: VisoClassService,
          useValue: mockVisoClassService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<MyClassController>(MyClassController);
    service = module.get<VisoClassService>(VisoClassService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createVisoClassDto: CreateVisoClassDto = {
      class_name: 'Test Class',
      class_function: ['temperature_monitoring', 'humidity_sensing'],
      objects: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
    };

    it('should create a viso class successfully', async () => {
      mockVisoClassService.create.mockResolvedValue(mockVisoClassResponseDto);

      const result = await controller.create(createVisoClassDto);

      expect(service.create).toHaveBeenCalledWith(createVisoClassDto);
      expect(result).toEqual(mockVisoClassResponseDto);
    });

    it('should throw InternalServerErrorException when service fails', async () => {
      mockVisoClassService.create.mockRejectedValue(
        new InternalServerErrorException('Failed to create class'),
      );

      await expect(controller.create(createVisoClassDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all viso classes', async () => {
      const mockClasses = [
        mockVisoClassResponseDto,
        { ...mockVisoClassResponseDto, id: '507f1f77bcf86cd799439014' },
      ];
      mockVisoClassService.findAll.mockResolvedValue(mockClasses);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockClasses);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('should throw InternalServerErrorException when service fails', async () => {
      mockVisoClassService.findAll.mockRejectedValue(
        new InternalServerErrorException('Failed to find classes'),
      );

      await expect(controller.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should return a viso class by id', async () => {
      mockVisoClassService.findOne.mockResolvedValue(mockVisoClassResponseDto);

      const result = await controller.findOne(validId);

      expect(service.findOne).toHaveBeenCalledWith(validId);
      expect(result).toEqual(mockVisoClassResponseDto);
    });

    it('should throw NotFoundException when class is not found', async () => {
      mockVisoClassService.findOne.mockRejectedValue(
        new NotFoundException(`MyClass with id ${validId} not found`),
      );

      await expect(controller.findOne(validId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException when service fails', async () => {
      mockVisoClassService.findOne.mockRejectedValue(
        new InternalServerErrorException('Failed to find class'),
      );

      await expect(controller.findOne(validId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
