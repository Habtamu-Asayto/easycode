import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload, ICurrentUser } from '../../../shared/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret',
    });
  }

  async validate(payload: IJwtPayload): Promise<ICurrentUser> {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      roles: payload.roles || [],
      permissions: payload.permissions || [],
    };
  }
}
