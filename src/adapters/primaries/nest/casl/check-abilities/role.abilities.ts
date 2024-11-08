import { AppAbility } from '../casl-ability.factory';
import { Action, Scope } from '../scope.enum';

export const canReadRole = (ability: AppAbility) =>
  ability.can(Action.Read, Scope.ROLE);

export const canDeleteRole = (ability: AppAbility) =>
  ability.can(Action.Delete, Scope.ROLE);

export const canUpdateRole = (ability: AppAbility) =>
  ability.can(Action.Update, Scope.ROLE);

export const canCreateRole = (ability: AppAbility) =>
  ability.can(Action.Create, Scope.ROLE);
