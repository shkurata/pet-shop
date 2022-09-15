import { GqlError } from './error';
import { UserInterface } from './user';
import { StringValue } from 'ms';

export interface AuthResultPayload {
  data: LoginResultPayload | null;
  errors?: GqlError[];
}

export interface LoginResultPayload {
  login: {
    user?: UserInterface;
    access_token: string;
    expires_in: StringValue;
  };
}
