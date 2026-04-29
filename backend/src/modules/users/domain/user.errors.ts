export class UserDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserDomainError';
  }
}

export class UserNotFoundException extends UserDomainError {
  constructor(idOrUsername: number | string) {
    super(`User ${idOrUsername} not found`);
    this.name = 'UserNotFoundException';
  }
}

export class UserAlreadyExistsException extends UserDomainError {
  constructor(field: string, value: string) {
    super(`User with ${field} '${value}' already exists`);
    this.name = 'UserAlreadyExistsException';
  }
}
