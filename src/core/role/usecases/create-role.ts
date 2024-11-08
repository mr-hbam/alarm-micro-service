import { RoleEntity } from '../entities/role.entity';
import { UserNamespaceFilterPayloadOld } from '../../common/type';
import { RoleRepository } from '../repositories';

export class CreateRoleUseCase {
  constructor(private roleRepository: RoleRepository) {}

  public async execute(
    options: UserNamespaceFilterPayloadOld,
    role: CreateRolePayload,
  ): Promise<CreateRoleResponse> {
    return this.roleRepository.createRole(role, options);
  }
}

//---------- Types ----------//

export class CreateRolePayload extends RoleEntity {}
export class CreateRoleResponse {
  key: string;
}
