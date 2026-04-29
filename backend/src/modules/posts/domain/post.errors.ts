export class PostDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PostDomainError';
  }
}

export class PostNotFoundException extends PostDomainError {
  constructor(identifier: string | number) {
    super(`Post with identifier "${identifier}" not found`);
    this.name = 'PostNotFoundException';
  }
}

export class UnauthorizedPostActionException extends PostDomainError {
  constructor(action: string) {
    super(`Unauthorized to perform action: ${action}`);
    this.name = 'UnauthorizedPostActionException';
  }
}

export class DuplicatePostSlugException extends PostDomainError {
  constructor(slug: string) {
    super(`Post with slug "${slug}" already exists`);
    this.name = 'DuplicatePostSlugException';
  }
}
