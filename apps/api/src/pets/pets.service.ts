import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { Pet } from './models/pet.model';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet) private readonly petRepository: Repository<Pet>
  ) {}

  create(createPetInput: CreatePetInput): Promise<Pet> {
    return this.petRepository.save(createPetInput);
  }

  findAll(): Promise<Pet[]> {
    return this.petRepository.find();
  }

  async findOne(id: string): Promise<Pet> {
    const pet = await this.petRepository.findOneBy({ id });
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

  async remove(id: string): Promise<Pet> {
    const pet = await this.findOne(id);
    await this.petRepository.delete({ id });
    return pet;
  }
}
