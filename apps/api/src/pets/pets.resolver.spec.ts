import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { Pet } from './models/pet.model';
import { PetsResolver } from './pets.resolver';
import { PetsService } from './pets.service';

describe('PetsResolver', () => {
  let resolver: PetsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsResolver,
        PetsService,
        UsersService,
        {
          provide: getRepositoryToken(Pet),
          useValue: {
            find: jest.fn().mockResolvedValue([{ id: 1, name: 'Rex' }]),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue({ id: 1, name: 'Test' }),
          },
        },
      ],
    }).compile();

    resolver = module.get<PetsResolver>(PetsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
