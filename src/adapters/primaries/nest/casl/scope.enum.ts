export enum Scope {
  TRACK = 'track',
  UNIT = 'unit',
  MAINTENANCE = 'maintenance',
  ASSIGNMENT = 'assignment',
  PLANNING = 'planning',
  OPERATOR = 'operator',
  STOP = 'stop',
  Optimization = 'optimization',
  ROLE = 'role',
  USER = 'user',
  REPORT = 'report',
  CLAIMS = 'claim',
  ALARM = 'alarm',
}

export enum Action {
  Manage = 'manage',
  Create = 'cr',
  Read = 'rd',
  Update = 'upd',
  Delete = 'dl',
}

const extractScopeAction = (
  scopeAction: string,
): { scope: Scope; actions: Action[] | undefined } => {
  const scopeActionArr = scopeAction.split(':');
  if (scopeActionArr.length === 2) {
    const scope: Scope = scopeActionArr[1] as Scope;
    let actions: Action[];
    switch (scopeActionArr[0]) {
      case 'cr':
        actions = [Action.Create];
        break;
      case 'upd':
        actions = [Action.Update];
        break;
      case 'dl':
        actions = [Action.Delete];
        break;
      case 'rd':
        actions = [Action.Read];
        break;
    }
    return { scope, actions };
  }
};

export const extractScopesAction = (
  scopesAction: string[],
): { scope: Scope; action: Action }[] => {
  const scopes = [];
  for (const scopeAction of scopesAction) {
    const result = extractScopeAction(scopeAction);
    if (result !== undefined) {
      for (const action of result.actions) {
        scopes.push({ scope: result.scope, action });
      }
    }
  }
  return scopes;
};
