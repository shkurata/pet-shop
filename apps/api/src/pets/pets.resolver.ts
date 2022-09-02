import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PetsService } from './pets.service';
import { Pet } from './models/pet.model';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { UsersService } from '../users/users.service';

@Resolver(() => Pet)
export class PetsResolver {
  constructor(
    private readonly petsService: PetsService,
    private readonly usersService: UsersService
  ) {}

  @Mutation(() => Pet)
  async createPet(@Args('createPetInput') createPetInput: CreatePetInput) {
    const user = await this.usersService.findOne(createPetInput.ownerId);
    console.log('USER', user);

    if (!user) {
      throw new Error('User not found');
    }
    return this.petsService.create(createPetInput);
  }

  @Query(() => [Pet], { name: 'pets' })
  findAll() {
    return this.petsService.findAll();
  }

  @Query(() => Pet, { name: 'pet' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.petsService.findOne(id);
  }

  @Mutation(() => Pet)
  updatePet(@Args('updatePetInput') updatePetInput: UpdatePetInput) {
    return this.petsService.update(updatePetInput.id, updatePetInput);
  }

  @Mutation(() => Pet)
  removePet(@Args('id', { type: () => Int }) id: number) {
    return this.petsService.remove(id);
  }
}
