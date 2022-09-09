import { Test, TestingModule } from '@nestjs/testing';
import { Context } from 'apollo-server-core';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useFactory: () => ({
            signup: jest.fn(() => ({
              id: '100',
              username: 'test_user',
              password: 'password',
            })),
            login: jest.fn(() => ({
              access_token: 'token',
            })),
          }),
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('signup', () => {
    it('should create a user', async () => {
      const result = await resolver.signup({
        username: 'test_user',
        password: 'password',
      });
      expect(result.username).toEqual('test_user');
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const result = await resolver.login(
        {
          username: 'test_user',
          password: 'password',
        },
        {} as Context
      );
      expect(result.access_token).toEqual('token');
    });
  });
});
