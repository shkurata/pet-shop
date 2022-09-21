import { Test, TestingModule } from '@nestjs/testing';
import { UserContextPayload } from '@pet-shop/data';
import { AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { User } from './models/user.model';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

const user: User = {
  id: '100',
  username: 'test_user',
  password: 'password',
};

let userAbility: AppAbility;

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        CaslAbilityFactory,
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
    const caslAbilityFactory =
      module.get<CaslAbilityFactory>(CaslAbilityFactory);
    userAbility = caslAbilityFactory.createForUser({
      isAdmin: true,
      userId: '100',
    } as UserContextPayload);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const result = await resolver.createUser({
        username: 'test_user',
        password: 'password',
      });
      expect(result).toEqual({
        id: '100',
        username: 'test_user',
        password: 'password',
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await resolver.findAll(userAbility);
      expect(result).toEqual([user]);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const result = await resolver.findOne('100', userAbility);
      expect(result).toEqual({
        id: '100',
        username: 'test_user',
        password: 'password',
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const result = await resolver.updateUser(
        {
          id: '100',
          username: 'test_user',
        },
        userAbility
      );
      expect(result).toEqual({
        id: '100',
        username: 'test_user',
        password: 'password',
      });
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      const result = await resolver.removeUser('100', userAbility);
      expect(result).toEqual({
        id: '100',
        username: 'test_user',
        password: 'password',
      });
    });
  });
});
