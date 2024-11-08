import { compare, hash } from '../../../common/cryptography/hash';
import { encrypt } from '../../../common/cryptography/cryptography';
import { UserRepository } from '../../user/repositories';

export class UpdatePasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(
    payload: UpdatePasswordPayload,
  ): Promise<UpdatePasswordResponse> {
    const { username, password, newPassword } = payload;

    const encryptedUsername = encrypt(username, true);
    const result = await this.userRepository.authenticateUser(
      encryptedUsername,
    );

    if (result?.password) {
      const isValid = await compare(password, result.password);

      if (isValid) {
        const hashedNewPassword = await hash(newPassword);
        return this.userRepository.updatePassword(
          encryptedUsername,
          hashedNewPassword,
        );
      }
    }

    return { matchedCount: 0, modifiedCount: 0, modified: false };
  }
}

//---------- Types ----------//

export interface UpdatePasswordPayload {
  username: string;
  password: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  matchedCount: number;
  modifiedCount: number;
  modified: boolean;
}
