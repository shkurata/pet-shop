import { PetInterface } from './pet';

export interface UserInterface {
  id: string;
  name?: string;
  email?: string;
  password: string;
  username: string;
  pets?: PetInterface[];
}

export interface UserResultPayload {
  user: UserInterface;
}

export interface LoggedInUserPayload {
  me: UserInterface;
}

export interface UserContextPayload {
  userId: string;
  username: string;
}
