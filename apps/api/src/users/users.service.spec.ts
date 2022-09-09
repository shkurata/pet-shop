import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.model';
import { UsersService } from './users.service';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

const user: User = {
  id: '100',
  username: 'test_user',
  password: 'password',
};

describe('UsersService', () => {
  let service: UsersService;
  const userRepositoryMock: MockType<Repository<User>> = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      userRepositoryMock.save.mockReturnValue(user);
      const newUser = await service.create(user);
      expect(newUser).toMatchObject(user);
      expect(userRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: '100', username: 'test_user' })
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      userRepositoryMock.find.mockReturnValue([user]);
      const users = await service.findAll();
      expect(users).toContainEqual(user);
      expect(userRepositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      userRepositoryMock.findOneBy.mockReturnValue(user);
      const foundUser = await service.findOne(user.id);
      expect(foundUser).toMatchObject(user);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: user.id,
      });
    });

    it('should throw an error if user is not found', async () => {
      userRepositoryMock.findOneBy.mockReturnValue(null);
      await expect(service.findOne(user.id)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      userRepositoryMock.findOneBy.mockReturnValue(user);
      userRepositoryMock.update.mockReturnValue(user);
      const updatedUser = await service.update(user.id, user);
      expect(updatedUser).toMatchObject(user);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: user.id,
      });
      expect(userRepositoryMock.update).toHaveBeenCalledWith(user.id, user);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      userRepositoryMock.findOneBy.mockReturnValue(user);
      userRepositoryMock.delete.mockReturnValue(user);
      const deletedUser = await service.remove(user.id);
      expect(deletedUser).toMatchObject(user);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: user.id,
      });
      expect(userRepositoryMock.delete).toHaveBeenCalledWith({ id: user.id });
    });
  });

  describe('findByUsername', () => {
    it('should return a user', async () => {
      userRepositoryMock.findOneBy.mockReturnValue(user);
      const foundUser = await service.findByUsername(user.username);
      expect(foundUser).toMatchObject(user);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        username: user.username,
      });
    });

    it('should throw an error if user is not found', async () => {
      userRepositoryMock.findOneBy.mockReturnValue(null);
      await expect(
        service.findByUsername(user.username)
      ).rejects.toThrowError();
    });
  });
});
