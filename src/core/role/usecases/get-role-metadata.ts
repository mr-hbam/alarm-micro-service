import {
  UserFilterPayloadOld,
  UserNamespaceFilterPayloadOld,
} from '../../common/type';
import { RoleRepository } from '../repositories';

export class GetRoleMetadataUseCase {
  constructor(private roleRepository: RoleRepository) {}

  public async execute(
    options: UserNamespaceFilterPayloadOld,
    role: GetRoleMetadataPayload,
  ): Promise<GetRoleMetadataResponse | null> {
    const metadata = await this.roleRepository.getRoleMetadata(
      { key: role.key },
      options,
    );

    if (metadata == null) {
      return null;
    }
    return metadata;
  }
}

//---------- Types ----------//

export class GetRoleMetadataPayload {
  key: string;
}
export class GetRoleMetadataResponse {
  name: string;
  members: number;
}
