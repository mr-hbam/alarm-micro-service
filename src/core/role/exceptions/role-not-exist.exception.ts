export class RoleNotExistError extends Error {
  constructor(message?: string) {
    super(message ?? 'Role does not exist.');
  }
}
