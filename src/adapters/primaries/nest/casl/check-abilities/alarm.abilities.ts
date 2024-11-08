import { AppAbility } from '../casl-ability.factory';
import { Action, Scope } from '../scope.enum';

export const canReadAlarm = (ability: AppAbility) =>
  ability.can(Action.Read, Scope.ALARM);

export const canDeleteAlarm = (ability: AppAbility) =>
  ability.can(Action.Delete, Scope.ALARM);

export const canUpdateAlarm = (ability: AppAbility) =>
  ability.can(Action.Update, Scope.ALARM);

export const canCreateAlarm = (ability: AppAbility) =>
  ability.can(Action.Create, Scope.ALARM);
