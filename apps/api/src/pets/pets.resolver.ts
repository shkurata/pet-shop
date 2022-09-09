import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PetsService } from './pets.service';
import { Pet } from './models/pet.model';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Pet)
@UseGuards(JwtAuthGuard)
export class PetsResolver {
  constructor(private readonly petsService: PetsService) {}

  @Mutation(() => Pet)
  async createPet(@Args('createPetInput') createPetInput: CreatePetInput) {
    return this.petsService.create(createPetInput);
  }

  @Query(() => [Pet], { name: 'pets' })
  async findAll() {
    return this.petsService.findAll();
  }

  @Query(() => Pet, { name: 'pet' })
  async findOne(@Args('id') id: string) {
    return this.petsService.findOne(id);
  }

  @Mutation(() => Pet)
  async updatePet(@Args('updatePetInput') updatePetInput: UpdatePetInput) {
    return this.petsService.update(updatePetInput.id, updatePetInput);
  }

  @Mutation(() => Pet)
  async removePet(@Args('id') id: string) {
    return this.petsService.remove(id);
  }
}
