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
      user,
    };
  }

  async signup(loginUserInput: LoginUserInput): Promise<User> {
    const password = await bcrypt.hash(loginUserInput.password, 10);
    return this.usersService.create({ ...loginUserInput, password });
  }
}
