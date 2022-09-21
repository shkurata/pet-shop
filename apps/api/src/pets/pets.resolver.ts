import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PetsService } from './pets.service';
import { Pet } from './models/pet.model';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { AppAbility } from '../casl/casl-ability.factory';
import { Action, UserContextPayload } from '@pet-shop/data';
import { PoliciesGuard } from '../casl/policies.guard';
import { CurrentUser } from '../users/user.decorator';
import { AuthAbility } from '../casl/ability.decorator';

@Resolver(() => Pet)
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class PetsResolver {
  constructor(private readonly petsService: PetsService) {}

  @Mutation(() => Pet)
  async createPet(
    @Args('createPetInput') createPetInput: CreatePetInput,
    @AuthAbility() userAbility: AppAbility,
    @CurrentUser() user: UserContextPayload
  ) {
    if (
      userAbility.cannot(Action.Create, { owner: { id: user.userId } } as Pet)
    ) {
      throw new ForbiddenException('You are not allowed to do this');
    }
    return this.petsService.create(createPetInput);
  }

  @Query(() => [Pet], { name: 'pets' })
  async findAll(@AuthAbility() userAbility: AppAbility) {
    const pets = await this.petsService.findAll();
    if (pets.some((pet) => userAbility.cannot(Action.Read, pet))) {
      throw new ForbiddenException('You are not allowed to do this');
    }
    return pets;
  }

  @Query(() => Pet, { name: 'pet' })
  async findOne(
    @Args('id') id: string,
    @AuthAbility() userAbility: AppAbility
  ) {
    const pet = await this.petsService.findOne(id);
    if (userAbility.cannot(Action.Read, pet)) {
      throw new ForbiddenException('You are not allowed to do this');
    }
    return pet;
  }

  @Mutation(() => Pet)
  async updatePet(
    @Args('updatePetInput') updatePetInput: UpdatePetInput,
    @AuthAbility() userAbility: AppAbility
  ) {
    if (
      userAbility.cannot(Action.Update, {
        owner: { id: updatePetInput.id },
      } as Pet)
    ) {
      throw new ForbiddenException('You are not allowed to do this');
    }
    return this.petsService.update(updatePetInput.id, updatePetInput);
  }

  @Mutation(() => Pet)
  async removePet(
    @Args('id') id: string,
    @AuthAbility() userAbility: AppAbility
  ) {
    try {
      const deletedPet = await this.petsService.remove(id, userAbility);
      return deletedPet;
    } catch (err) {
      if (err.message === 'Forbidden') {
        throw new ForbiddenException('You are not allowed to do this');
      }
      throw err;
    }
  }
}
