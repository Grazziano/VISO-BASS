import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { OwnersService } from '../owners/owners.service';
import * as bcrypt from 'bcrypt';

// Mock do bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let ownersService: jest.Mocked<OwnersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    toObject: jest.fn().mockReturnValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
    }),
  };

  beforeEach(async () => {
    const mockOwnersService = {
      findByEmail: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: OwnersService,
          useValue: mockOwnersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    ownersService = module.get(OwnersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'plainPassword';

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ownersService.findByEmail.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      // Act
      const result = await service.validateUser(email, password);

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(ownersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toEqual({
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        name: 'Test User',
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const password = 'plainPassword';

      ownersService.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(service.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(ownersService.findByEmail).toHaveBeenCalledWith(email);

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongPassword';

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ownersService.findByEmail.mockResolvedValue(mockUser as any);

      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(service.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(ownersService.findByEmail).toHaveBeenCalledWith(email);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });

    it('should throw UnauthorizedException when an error occurs', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'plainPassword';

      ownersService.findByEmail.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(ownersService.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('login', () => {
    it('should return access token when user is provided', () => {
      // Arrange
      const user = {
        email: 'test@example.com',
        _id: '507f1f77bcf86cd799439011',
      };
      const expectedToken = 'jwt-token';

      jwtService.sign.mockReturnValue(expectedToken);

      // Act
      const result = service.login(user);

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user._id,
      });
      expect(result).toEqual({
        access_token: expectedToken,
      });
    });
  });

  describe('me', () => {
    it('should return user data when valid JWT payload is provided', async () => {
      // Arrange
      const jwtPayload = {
        userId: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
      };

      ownersService.findByEmail.mockResolvedValue(mockUser as any);

      // Act
      const result = await service.me(jwtPayload);

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(ownersService.findByEmail).toHaveBeenCalledWith(jwtPayload.email);
      expect(result).toBe(mockUser);
    });

    it('should return null when user is not found', async () => {
      // Arrange
      const jwtPayload = {
        userId: '507f1f77bcf86cd799439011',
        email: 'nonexistent@example.com',
      };

      ownersService.findByEmail.mockResolvedValue(null);

      // Act
      const result = await service.me(jwtPayload);

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(ownersService.findByEmail).toHaveBeenCalledWith(jwtPayload.email);
      expect(result).toBeNull();
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
