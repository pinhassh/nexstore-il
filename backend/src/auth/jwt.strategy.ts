import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

export const JWT_SECRET = process.env.JWT_SECRET ?? 'nexstore-super-secret-key-change-in-prod';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
