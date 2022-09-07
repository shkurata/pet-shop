import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './models/pet.model';
import { PetsService } from './pets.service';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

const pet: Pet = {
  id: '1',
  name: 'Test Pet',
  ownerId: '100',
};

describe('PetsService', () => {
  let service: PetsService;
  const petRepositoryMock: MockType<Repository<Pet>> = {
    find: jest.fn(),
    findOneBy: jest.fn(),
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
      const newPet = await service.create(pet);
      expect(newPet).toMatchObject(pet);
      expect(petRepositoryMock.save).toHaveBeenCalledWith(pet);
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
      petRepositoryMock.findOneBy.mockReturnValue(pet);
      const foundPet = await service.findOne(pet.id);
      expect(foundPet).toMatchObject(pet);
      expect(petRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: pet.id });
    });

    it('should throw an error if pet not found', async () => {
      petRepositoryMock.findOneBy.mockReturnValue(null);
      await expect(service.findOne(pet.id)).rejects.toThrowError(
        'Pet not found'
      );
    });
  });

  describe('update', () => {
    it('should update a pet', async () => {
      petRepositoryMock.findOneBy.mockReturnValue(pet);
      petRepositoryMock.update.mockReturnValue(pet);
      const updatedPet = await service.update(pet.id, pet);
      expect(updatedPet).toMatchObject(pet);
      expect(petRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: pet.id });
      expect(petRepositoryMock.update).toHaveBeenCalledWith(pet.id, pet);
    });
  });

  describe('remove', () => {
    it('should remove a pet', async () => {
      petRepositoryMock.findOneBy.mockReturnValue(pet);
      petRepositoryMock.delete.mockReturnValue(pet);
      const deletedPet = await service.remove(pet.id);
      expect(deletedPet).toMatchObject(pet);
      expect(petRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: pet.id });
      expect(petRepositoryMock.delete).toHaveBeenCalledWith({ id: pet.id });
    });
  });
});
