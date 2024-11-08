import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as express from 'express';

@Injectable()
export class NamespaceJwt2FaStrategy extends PassportStrategy(
  Strategy,
  'namespace-jwt-2fa',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        NamespaceJwt2FaStrategy.extractJWT,
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
    console.log(
      `[NamespaceJwt2FaStrategy] validate: payload=${JSON.stringify(payload)}`,
    );
    if (payload['2faEnabled'] && !payload['2faAuthenticated']) {
      throw new UnauthorizedException();
    }

    if (!payload.namespace) {
      throw new ForbiddenException();
    }

    return payload;
  }
}
