import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../apps/auth/src/auth/auth.controller';
import { AuthService } from '../../../apps/auth/src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../apps/auth/src/users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserRole } from '../../../apps/auth/src/users/schemas/user.schema';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      const mockUser = {
        _id: '1',
        username: 'testuser',
        email: 'test@example.com',
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue({
        ...mockUser,
        id: '1',
        password: 'hashedpassword',
        role: UserRole.USER,
      } as User);
      mockJwtService.sign.mockReturnValue('test-token');

      const result = await controller.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token', 'test-token');
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(
        controller.login({
          username: 'testuser',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow();
    });
  });
}); 