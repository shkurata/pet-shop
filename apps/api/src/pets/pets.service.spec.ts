import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { Pet } from './models/pet.model';
import { PetsService } from './pets.service';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

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

describe('PetsService', () => {
  let service: PetsService;
  const petRepositoryMock: MockType<Repository<Pet>> = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        {
          provide: getRepositoryToken(Pet),
          useValue: petRepositoryMock,
        },
        {
          provide: UsersService,
          useFactory: () => ({
            findOne: jest.fn((id: string) => ({ ...user, id })),
          }),
        },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a pet', async () => {
      petRepositoryMock.save.mockReturnValue(pet);
      const newPet = await service.create({
        name: 'Test Pet',
        ownerId: '100',
      });
      expect(newPet).toMatchObject(pet);
      expect(petRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Test Pet', owner: user })
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of pets', async () => {
      petRepositoryMock.find.mockReturnValue([pet]);
      const pets = await service.findAll();
      expect(pets).toContainEqual(pet);
      expect(petRepositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a pet', async () => {
      petRepositoryMock.findOne.mockReturnValue(pet);
      const foundPet = await service.findOne(pet.id);
      expect(foundPet).toMatchObject(pet);
      expect(petRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: pet.id },
        relations: ['owner'],
      });
    });

    it('should throw an error if pet not found', async () => {
      petRepositoryMock.findOne.mockReturnValue(null);
      await expect(service.findOne(pet.id)).rejects.toThrowError(
        'Pet not found'
      );
    });
  });

  describe('update', () => {
    it('should update a pet', async () => {
      petRepositoryMock.findOne.mockReturnValue(pet);
      petRepositoryMock.update.mockReturnValue(pet);
      const updatedPet = await service.update(pet.id, pet);
      expect(updatedPet).toMatchObject(pet);
      expect(petRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: pet.id },
        relations: ['owner'],
      });
      expect(petRepositoryMock.update).toHaveBeenCalledWith(pet.id, pet);
    });
  });

  describe('remove', () => {
    it('should remove a pet', async () => {
      petRepositoryMock.findOne.mockReturnValue(pet);
      petRepositoryMock.delete.mockReturnValue(pet);
      const deletedPet = await service.remove(pet.id);
      expect(deletedPet).toMatchObject(pet);
      expect(petRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: pet.id },
        relations: ['owner'],
      });
      expect(petRepositoryMock.delete).toHaveBeenCalledWith({ id: pet.id });
    });
  });
});
