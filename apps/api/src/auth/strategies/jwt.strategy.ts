import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserContextPayload } from '@pet-shop/data';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: {
    sub: string;
    username: string;
  }): Promise<UserContextPayload> {
    const user = await this.userService.findOne(payload.sub);
    return {
      userId: payload.sub,
      username: payload.username,
      isAdmin: Boolean(user.isAdmin),
    };
  }
}
