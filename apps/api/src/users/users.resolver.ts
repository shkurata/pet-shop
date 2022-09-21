import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from './user.decorator';
import { Action, UserContextPayload } from '@pet-shop/data';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { AppAbility } from '../casl/casl-ability.factory';
import { PoliciesGuard } from '../casl/policies.guard';
import { AuthAbility } from '../casl/ability.decorator';

@Resolver(() => User)
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, User))
  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  async findAll(@AuthAbility() userAbility: AppAbility) {
    const users = await this.usersService.findAll();
    if (users.some((user) => userAbility.cannot(Action.Read, user))) {
      throw new ForbiddenException('You are not allowed to do this');
    }
    return users;
  }

  @Query(() => User, { name: 'me' })
  findMe(
    @CurrentUser() user: UserContextPayload,
    @AuthAbility() userAbility: AppAbility
  ) {
    return this.findOne(user.userId, userAbility);
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @AuthAbility() userAbility: AppAbility
  ) {
    const foundUser = await this.usersService.findOne(id);
    if (userAbility.cannot(Action.Read, foundUser)) {
      throw new ForbiddenException('You are not allowed to do this');
    }
    return foundUser;
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @AuthAbility() userAbility: AppAbility
  ) {
    if (userAbility.cannot(Action.Update, { id: updateUserInput.id } as User)) {
      throw new ForbiddenException('You are not allowed to do this');
    }
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(
    @Args('id', { type: () => String }) id: string,
    @AuthAbility() userAbility: AppAbility
  ) {
    if (userAbility.cannot(Action.Delete, { id } as User)) {
      throw new ForbiddenException('You are not allowed to do this');
    }
    return this.usersService.remove(id);
  }
}
