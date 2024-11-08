import { authenticator } from 'otplib';
import { encrypt } from '../../../common/cryptography';
import { UserRepository } from '../../user/repositories';

export class Configure2FaUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(
    payload: Configure2FaUseCaseRequest,
  ): Promise<Configure2FaUseCaseResponse> {
    const encryptedUsername = encrypt(payload.username, true);
    const result = await this.userRepository.get2FaSecret(encryptedUsername);
    const isValid = authenticator.verify({
      token: payload.code,
      secret: result['2fa'].codeTmp ?? '',
    });

    if (isValid) {
      const saveResult = await this.userRepository.save2FaSecret(
        encryptedUsername,
        {
          twoFaSecret: result['2fa'].codeTmp,
          temporary: false,
        },
      );
      return saveResult.modified;
    }

    return false;
  }
}

//========================
export interface Configure2FaUseCaseRequest {
  username: string;
  code: string;
}
export type Configure2FaUseCaseResponse = boolean;
