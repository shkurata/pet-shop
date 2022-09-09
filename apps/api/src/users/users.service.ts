import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './models/user.model';
import { hash } from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const password = await hash(createUserInput.password, 10);
    return this.userRepository.save({
      ...createUserInput,
      password,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['pets'] });
  }

  async findOne(id: string): Promise<User> {
    return this.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User> {
    return this.findOneBy({ username });
  }

  async findOneBy(options: FindOptionsWhere<User>): Promise<User> {
    const user = this.userRepository.findOne({
      where: options,
      relations: ['pets'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.update(id, updateUserInput);
    return { ...user, ...updateUserInput };
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.delete({ id });
    return user;
  }
}
