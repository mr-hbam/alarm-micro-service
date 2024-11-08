import { RoleRepository } from '../repositories';
import { UserFilter } from '../../entity.interface';
import { UpdateResponse } from '../../common/repository/global.repository';
import { Permissions } from 'src/core/role/entities/permission.entity';
import { UserNamespaceFilterPayloadOld } from '../../common/type';

export class UpdatePermissionsRolesUseCase {
  constructor(private roleRepository: RoleRepository) {}

  public async execute(
    roleKey: string,
    permissions: Permissions[],
    options: UserNamespaceFilterPayloadOld,
  ): Promise<UpdateResponse> {
    return this.roleRepository.updateRolePermissions(
      roleKey,
      permissions,
      options,
    );
  }
}
