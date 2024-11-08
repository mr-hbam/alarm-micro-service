import { authenticator } from 'otplib';
import { encrypt } from '../../../common/cryptography';
import { UserRepository } from '../../user/repositories';

export class Validate2FaUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(
    payload: Validate2FaPayload,
  ): Promise<Validate2FaResponse> {
    const encryptedUsername = encrypt(payload.username, true);
    const result = await this.userRepository.get2FaSecret(encryptedUsername);
    const isValid = authenticator.verify({
      token: payload.code,
      secret: result['2fa'].code ?? '',
    });

    return { success: isValid };
  }
}

// =======================================
export interface Validate2FaPayload {
  username: string;
  code: string;
}

export type Validate2FaResponse = {
  success: boolean;
};
