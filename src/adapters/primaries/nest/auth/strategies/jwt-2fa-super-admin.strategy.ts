import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as express from 'express';
import { UserRole } from '../../../../../core/user/entities';

@Injectable()
export class Jwt2faSuperAdminStrategy extends PassportStrategy(
  Strategy,
  'jwt-2fa-super-admin',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        Jwt2faSuperAdminStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: 'secretKey',
    });
  }

  private static extractJWT(req: express.Request): string | null {
    if (
      req.cookies &&
      'accessToken' in req.cookies &&
      req.cookies.accessToken.length > 0
    ) {
      return req.cookies.accessToken;
    }
    return null;
  }

  async validate(payload: any) {
    console.log(`[JwtStrategy] validate: payload=${JSON.stringify(payload)}`);
    if (
      (payload['2faEnabled'] && !payload['2faAuthenticated']) ||
      payload['type'] !== UserRole.SUPER_ADMIN
    ) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
