import { Test, TestingModule } from '@nestjs/testing';
import { User } from './models/user.model';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

const user: User = {
  id: '100',
  name: 'Test User',
};

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useFactory: () => ({
            create: jest.fn((userInput: User) => ({
              ...user,
              ...userInput,
            })),
            findAll: jest.fn(() => [user]),
            findOne: jest.fn((id: string) => ({ ...user, id })),
            update: jest.fn((id: string, userInput: User) => ({
              ...user,
              id,
              ...userInput,
            })),
            remove: jest.fn((id: string) => ({ ...user, id })),
          }),
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const result = await resolver.createUser({ name: 'Test User' });
      expect(result).toEqual({
        id: '100',
        name: 'Test User',
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await resolver.findAll();
      expect(result).toEqual([user]);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const result = await resolver.findOne('100');
      expect(result).toEqual({
        id: '100',
        name: 'Test User',
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const result = await resolver.updateUser({
        id: '100',
        name: 'Test User',
      });
      expect(result).toEqual({
        id: '100',
        name: 'Test User',
      });
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      const result = await resolver.removeUser('100');
      expect(result).toEqual({
        id: '100',
        name: 'Test User',
      });
    });
  });
});
