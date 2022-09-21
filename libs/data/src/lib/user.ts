import { PetInterface } from './pet';

export interface UserInterface {
  id: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
  password: string;
  username: string;
  pets?: PetInterface[];
  ability?: unknown;
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
  isAdmin: boolean;
}
