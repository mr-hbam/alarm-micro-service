import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { UserRequest } from '../../../../core/common/type';
import { Action, extractScopesAction } from './scope.enum';
import { UserRole } from '../../../../core/user/entities';

type Subjects = any;

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserRequest | null) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (user) {
      const { permissions, type } = user as any;
      if (type === UserRole.RESELLER || type === UserRole.SUPER_ADMIN) {
        can(Action.Manage, 'all'); // read-write access to everything
      } else {
        const scopes = extractScopesAction(permissions);
        for (const policy of scopes) {
          can(policy.action, policy.scope);
        }
      }
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
