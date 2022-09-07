import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PetsService } from './pets.service';
import { Pet } from './models/pet.model';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { UsersService } from '../users/users.service';
import { User } from '../users/models/user.model';

@Resolver(() => Pet)
export class PetsResolver {
  constructor(
    private readonly petsService: PetsService,
    private readonly usersService: UsersService
  ) {}

  @ResolveField('owner', () => User)
  getOwner(@Parent() pet: Pet) {
    return this.usersService.findOne(pet.ownerId);
  }

  @Mutation(() => Pet)
  async createPet(@Args('createPetInput') createPetInput: CreatePetInput) {
    const user = await this.usersService.findOne(createPetInput.ownerId);

    if (!user) {
      throw new Error('User not found');
    }
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
