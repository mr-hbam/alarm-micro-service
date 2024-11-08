import { AppAbility } from '../casl-ability.factory';
import { Action, Scope } from '../scope.enum';

export const canReadUser = (ability: AppAbility) =>
  ability.can(Action.Read, Scope.USER);

export const canDeleteUser = (ability: AppAbility) =>
  ability.can(Action.Delete, Scope.USER);

export const canUpdateUser = (ability: AppAbility) =>
  ability.can(Action.Update, Scope.USER);

export const canCreateUser = (ability: AppAbility) =>
  ability.can(Action.Create, Scope.USER);
