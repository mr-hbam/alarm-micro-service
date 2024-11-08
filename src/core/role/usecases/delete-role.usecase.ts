import { UserFilter } from '../../entity.interface';
import { RoleRepository } from '../repositories';
import { DeleteResponse } from '../../common/repository/global.repository';
import { UserNamespaceFilterPayloadOld } from '../../common/type';

export class DeleteRolesUseCase {
  constructor(private roleRepository: RoleRepository) {}

  public async execute(
    options: UserNamespaceFilterPayloadOld,
    params: DeleteRolesPayload,
  ): Promise<DeleteResponse> {
    return this.roleRepository.deleteRoles({ key: params.roleKeys }, options);
  }
}

// Types
export interface DeleteRolesPayload {
  roleKeys: string[];
}
