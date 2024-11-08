import { JwtService } from '@nestjs/jwt';
import { generateAccessToken, generateRefreshToken } from '../auth.helper';
import { UserRepository } from '../../user/repositories';
import { UserRole } from '../../user/entities';

export class GenerateAccessTokenUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  execute(
    payload: GenerateAccessTokenPayload,
    option: GenerateTokenOptions,
  ): GenerateAccessTokenResponse {
    const result = {
      accessToken: generateAccessToken(this.jwtService, payload),
    };
    if (
      option === GenerateTokenOptions.REFRESH_TOKEN ||
      option === GenerateTokenOptions.BOTH
    ) {
      const refreshPayload = {
        username: payload.username,
        '2faAuthenticated': payload['2faAuthenticated'],
      };
      if (payload.parent) {
        refreshPayload['parent'] = payload.parent;
      }
      result['refreshToken'] = generateRefreshToken(
        this.jwtService,
        refreshPayload,
      );
    }
    return result;
  }
}

// ============================
export interface GenerateAccessTokenPayload {
  namespace?: string;
  key: string;
  username: string;
  type: UserRole;
  '2faEnabled': boolean;
  '2faAuthenticated': boolean;
  permissions: string[];
  parent?: string;
}

export interface GenerateAccessTokenResponse {
  accessToken: {
    token: string;
    exp: Date;
  };
  refreshToken?: {
    token: string;
    exp: Date;
  };
}

export enum GenerateTokenOptions {
  BOTH = 'BOTH',
  ACCESS_TOKEN = 'access-token',
  REFRESH_TOKEN = 'refresh-token',
}
