import { RoleNotExistError } from '../exceptions/role-not-exist.exception';
import { UserFilter } from '../../entity.interface';
import { GetRolePermissionsResponse, RoleRepository } from '../repositories';
import { UserNamespaceFilterPayloadOld } from '../../common/type';

export class GetPermissionsRolesUseCase {
  constructor(private roleRepository: RoleRepository) {}

  public async execute(
    roleKey: string,
    options: UserNamespaceFilterPayloadOld,
  ): Promise<GetRolePermissionsResponse> {
    const result = await this.roleRepository.getRolePermissions(
      roleKey,
      options,
    );

    if (result) {
      return result;
    }
    throw new RoleNotExistError();
  }
}
