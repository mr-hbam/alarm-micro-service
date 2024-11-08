import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { encrypt } from '../../../common/cryptography';
import { UserOldRepository, UserRepository } from '../../user/repositories';

export class GenerateQrCodeUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(
    payload: GenerateAccessTokenPayload,
  ): Promise<GenerateAccessTokenResponse> {
    const twoFaSecret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      payload.username,
      'TELEMATICS',
      twoFaSecret,
    );
    const qr = await toDataURL(otpAuthUrl);
    const result = await this.userRepository.save2FaSecret(
      encrypt(payload.username, true),
      { twoFaSecret, temporary: true },
    );
    if (result.matchedCount) {
      return {
        twoFaSecret,
        qrcode: qr,
      };
    }

    return null;
  }
}

// ############################
export interface GenerateAccessTokenPayload {
  username: string;
}

export interface GenerateAccessTokenResponse {
  twoFaSecret: string;
  qrcode: string;
}
