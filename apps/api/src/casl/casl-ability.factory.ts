import { Injectable } from '@nestjs/common';
import { Pet } from '../pets/models/pet.model';
import { User } from '../users/models/user.model';
import {
  InferSubjects,
  AbilityBuilder,
  Ability,
  AbilityClass,
  ExtractSubjectType,
  MongoQuery,
} from '@casl/ability';
import { Action, AppAllSubject, UserContextPayload } from '@pet-shop/data';

type Subjects =
  | InferSubjects<typeof User>
  | InferSubjects<typeof Pet>
  | AppAllSubject;

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserContextPayload) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>
    );

    if (user.isAdmin) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Manage, Pet, <MongoQuery>{ 'owner.id': user.userId }); // read-write access to own pets
      can([Action.Read, Action.Delete, Action.Update], User, {
        id: user.userId,
      }); // read-write access to own profile
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
