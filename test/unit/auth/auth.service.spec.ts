import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../apps/auth/src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../apps/auth/src/users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../../apps/auth/src/users/schemas/user.schema';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const mockUser = {
        _id: '1',
        username: 'testuser',
        password: 'hashedPassword',
        email: 'test@example.com',
        role: 'user',
      } as User;

      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(mockUser);
      jest.spyOn(usersService, 'validatePassword').mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password');
      expect(result).toBeDefined();
      expect(result?.username).toBe('testuser');
    });

    it('should return null when credentials are invalid', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null);

      const result = await service.validateUser('testuser', 'wrongpassword');
      expect(result).toBeNull();
    });
  });
}); 