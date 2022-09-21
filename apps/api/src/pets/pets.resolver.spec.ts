import { Test, TestingModule } from '@nestjs/testing';
import { UserContextPayload } from '@pet-shop/data';
import { AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { User } from '../users/models/user.model';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { Pet } from './models/pet.model';
import { PetsResolver } from './pets.resolver';
import { PetsService } from './pets.service';

const user: User = {
  id: '100',
  username: 'test_user',
  password: 'password',
};

const pet: Pet = {
  id: '1',
  name: 'Test Pet',
  owner: user,
};

let userAbility: AppAbility;

describe('PetsResolver', () => {
  let resolver: PetsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsResolver,
        CaslAbilityFactory,
        {
          provide: PetsService,
          useFactory: () => ({
            create: jest.fn((petInput: CreatePetInput) => ({
              ...pet,
              ...petInput,
            })),
            findAll: jest.fn(() => [pet]),
            findOne: jest.fn((id: string) => ({ ...pet, id })),
            update: jest.fn((id: string, petUpdateInput: UpdatePetInput) => ({
              ...pet,
              id,
              ...petUpdateInput,
            })),
            remove: jest.fn((id: string) => ({ ...pet, id })),
          }),
        },
      ],
    }).compile();

    resolver = module.get<PetsResolver>(PetsResolver);
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

  describe('createPet', () => {
    it('should create a pet', async () => {
      const newPet = await resolver.createPet(
        {
          name: 'Test Pet',
          ownerId: user.id,
        },
        userAbility,
        { userId: user.id } as UserContextPayload
      );
      expect(newPet).toEqual({
        id: '1',
        name: 'Test Pet',
        owner: user,
        ownerId: user.id,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of pets', async () => {
      const pets = await resolver.findAll(userAbility);
      expect(pets).toEqual([pet]);
    });
  });

  describe('findOne', () => {
    it('should return a pet', async () => {
      const pet = await resolver.findOne('1', userAbility);
      expect(pet).toEqual({
        id: '1',
        name: 'Test Pet',
        owner: user,
      });
    });
  });

  describe('updatePet', () => {
    it('should update a pet', async () => {
      const updatedPet = await resolver.updatePet(
        {
          id: '1',
          name: 'Updated Pet',
          ownerId: user.id,
        },
        userAbility
      );
      expect(updatedPet).toEqual({
        id: '1',
        name: 'Updated Pet',
        owner: user,
        ownerId: user.id,
      });
    });
  });

  describe('removePet', () => {
    it('should remove a pet', async () => {
      const removedPet = await resolver.removePet('1', userAbility);
      expect(removedPet).toEqual({
        id: '1',
        name: 'Test Pet',
        owner: user,
      });
    });
  });
});
