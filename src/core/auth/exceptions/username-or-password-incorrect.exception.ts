export class UsernameOrPasswordIncorrectError extends Error {
  constructor(message?: string) {
    super(message ?? 'Username or password incorrect.');
  }
}
