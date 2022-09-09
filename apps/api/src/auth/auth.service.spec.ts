import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

const user: User = {
  id: '100',
  username: 'test_user',
  password: 'password',
};
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useFactory: () => ({
            create: jest.fn((userInput: User) => ({
              ...user,
              ...userInput,
            })),
            findByUsername: jest.fn((username: string) => ({
              ...user,
              username,
              password: bcrypt.hashSync(user.password, 10),
            })),
          }),
        },
        {
          provide: JwtService,
          useFactory: () => ({
            sign: jest.fn(() => 'token'),
          }),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a user', async () => {
      const result = await service.signup({
        username: 'test_user',
        password: 'password',
      });
      expect(result.username).toEqual('test_user');
      expect(await bcrypt.compare('password', result.password)).toBeTruthy();
    });
  });

  describe('login', () => {
    it('should return a token', async () => {
      const result = await service.login({
        username: 'test_user',
        password: 'password',
      });
      expect(result.access_token).toEqual('token');
    });
  });

  describe('validateUser', () => {
    it('should return a user', async () => {
      const result = await service.validateUser('test_user', 'password');
      expect(result.username).toEqual('test_user');
    });

    it('should return null', async () => {
      const result = await service.validateUser('test_user', 'wrong_password');
      expect(result).toBeNull();
    });
  });
});
