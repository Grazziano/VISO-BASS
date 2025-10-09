import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OwnersService } from '../owners/owners.service';
import { IOwner } from '../owners/interfaces/owner.interface';
import { AuthenticatedRequest } from './types/jwt-payload.interface';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let ownersService: jest.Mocked<OwnersService>;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOwnerData: IOwner = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
  };

  beforeEach(async () => {
    const mockAuthService = {
      validateUser: jest.fn(),
      login: jest.fn(),
      me: jest.fn(),
      ownersService: {
        create: jest.fn(),
      },
    };

    const mockOwnersService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: OwnersService,
          useValue: mockOwnersService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    ownersService = module.get(OwnersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const expectedUser = { ...mockUser, password: undefined };
      (authService as any).ownersService.create.mockResolvedValue(expectedUser);

      // Act
      const result = await controller.register(mockOwnerData);

      // Assert
      expect((authService as any).ownersService.create).toHaveBeenCalledWith(
        mockOwnerData,
      );
      expect(result).toEqual(expectedUser);
    });

    it('should throw error when registration fails', async () => {
      // Arrange
      const error = new Error('Email já está em uso');
      (authService as any).ownersService.create.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.register(mockOwnerData)).rejects.toThrow(error);
      expect((authService as any).ownersService.create).toHaveBeenCalledWith(
        mockOwnerData,
      );
    });
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const validatedUser = { ...mockUser, password: undefined };
      const expectedResponse = {
        access_token: 'jwt-token',
      };

      authService.validateUser.mockResolvedValue(validatedUser);
      authService.login.mockReturnValue(expectedResponse);

      // Act
      const result = await controller.login(loginData);

      // Assert
      expect(authService.validateUser).toHaveBeenCalledWith(
        loginData.email,
        loginData.password,
      );
      expect(authService.login).toHaveBeenCalledWith(validatedUser);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      authService.validateUser.mockRejectedValue(
        new UnauthorizedException('Credenciais inválidas'),
      );

      // Act & Assert
      await expect(controller.login(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith(
        loginData.email,
        loginData.password,
      );
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  describe('me', () => {
    it('should return user data when valid JWT is provided', async () => {
      // Arrange
      const mockRequest: AuthenticatedRequest = {
        user: {
          email: 'test@example.com',
          userId: '507f1f77bcf86cd799439011',
        },
      } as AuthenticatedRequest;

      authService.me.mockResolvedValue(mockUser as any);

      // Act
      const result = await controller.me(mockRequest);

      // Assert
      expect(authService.me).toHaveBeenCalledWith(mockRequest.user);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      // Arrange
      const mockRequest: AuthenticatedRequest = {
        user: {
          email: 'nonexistent@example.com',
          userId: '507f1f77bcf86cd799439011',
        },
      } as AuthenticatedRequest;

      authService.me.mockResolvedValue(null);

      // Act
      const result = await controller.me(mockRequest);

      // Assert
      expect(authService.me).toHaveBeenCalledWith(mockRequest.user);
      expect(result).toBeNull();
    });

    it('should handle errors from authService.me', async () => {
      // Arrange
      const mockRequest: AuthenticatedRequest = {
        user: {
          email: 'test@example.com',
          userId: '507f1f77bcf86cd799439011',
        },
      } as AuthenticatedRequest;

      const error = new Error('Database error');
      authService.me.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.me(mockRequest)).rejects.toThrow(error);
      expect(authService.me).toHaveBeenCalledWith(mockRequest.user);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
