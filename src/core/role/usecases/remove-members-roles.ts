import { RoleRepository } from '../repositories';
import { UpdateResponse } from '../../common/repository/global.repository';
import { UserNamespaceFilterPayloadOld } from '../../common/type';
import { UserRepository } from '../../user/repositories';
import { NotAuthorizedError } from '../../common/exceptions/not-authorized.exception';

export class RemoveMembersFromRoleUseCase {
  constructor(
    private roleRepository: RoleRepository,
    private userRepository: UserRepository,
  ) {}

  public async execute(
    options: UserNamespaceFilterPayloadOld,
    { roleKey, members }: AddMembersToRolePayload,
  ): Promise<UpdateResponse> {
    const canMakeAction = await this.userRepository.canManageUsers(
      options.key,
      options.namespace,
      members,
    );
    if (canMakeAction == false) {
      throw new NotAuthorizedError();
    }

    return this.roleRepository.removeMembersFromRole(roleKey, members, options);
  }
}

// ##########################

interface AddMembersToRolePayload {
  roleKey: string;
  members: string[];
}
