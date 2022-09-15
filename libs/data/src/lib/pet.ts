import { UserInterface } from './user';

export interface PetInterface {
  id: string;
  name: string;
  type?: PetType;
  owner: UserInterface;
}

export enum PetType {
  Dog = 'Dog',
  Cat = 'Cat',
  Fish = 'Fish',
}
