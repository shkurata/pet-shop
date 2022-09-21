import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from '@pet-shop/data';
import { Repository } from 'typeorm';
import { AppAbility } from '../casl/casl-ability.factory';
import { UsersService } from '../users/users.service';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { Pet } from './models/pet.model';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet) private readonly petRepository: Repository<Pet>,
    private readonly usersService: UsersService
  ) {}

  async create(createPetInput: CreatePetInput): Promise<Pet> {
    const user = await this.usersService.findOne(createPetInput.ownerId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.petRepository.save({ ...createPetInput, owner: user });
  }

  findAll(): Promise<Pet[]> {
    return this.petRepository.find({
      relations: ['owner'],
    });
  }

  async findOne(id: string): Promise<Pet> {
    const pet = await this.petRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!pet) {
      throw new Error('Pet not found');
    }
    return pet;
  }

  async update(id: string, updatePetInput: UpdatePetInput): Promise<Pet> {
    const pet = await this.findOne(id);
    await this.petRepository.update(id, updatePetInput);
    return { ...pet, ...updatePetInput };
  }

  async remove(id: string, ability: AppAbility): Promise<Pet> {
    const pet = await this.findOne(id);
    if (ability.cannot(Action.Delete, pet)) {
      throw new Error('Forbidden');
    }
    await this.petRepository.delete({ id });
    return pet;
  }
}
