import { JwtService } from '@nestjs/jwt';
import { encrypt } from '../../../common/cryptography';
import { UserRole } from '../../user/entities';
import { UserRepository } from '../../user/repositories';

export class FetchAbilitiesUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  public async execute(
    payload: FetchAbilitiesPayload,
  ): Promise<FetchAbilitiesResponse> {
    const encryptedUsername = encrypt(payload.username, true);
    const permissions = await this.userRepository.fetchUserWithPermissions(
      encryptedUsername,
      payload.namespace,
    );

    if (permissions != null) {
      return permissions;
    }

    return null;
  }
}

// ############################
export class FetchAbilitiesPayload {
  username: string;
  namespace: string;
}

export class FetchAbilitiesResponse {
  key: string;
  'type': UserRole;
  'permissions': string[];
}
