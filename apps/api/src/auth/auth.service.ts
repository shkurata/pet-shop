import { Injectable } from '@nestjs/common';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { LoginResponse } from './dto/login-response';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dto/login-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Partial<User>): Promise<LoginResponse> {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
      expires_in: process.env.ACCESS_TOKEN_EXPIRATION,
      user,
    };
  }

  async signup(loginUserInput: LoginUserInput): Promise<User> {
    return this.usersService.create(loginUserInput);
  }
}
