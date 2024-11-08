export class UserAlreadyExistError extends Error {
  constructor(message?: string) {
    super(message ?? 'User already exists.');
  }
}
