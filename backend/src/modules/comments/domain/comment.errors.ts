export class CommentDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommentDomainError';
  }
}

export class CommentNotFoundException extends CommentDomainError {
  constructor(id: number) {
    super(`Comment with ID ${id} not found`);
    this.name = 'CommentNotFoundException';
  }
}

export class UnauthorizedCommentActionException extends CommentDomainError {
  constructor(action: string) {
    super(`Unauthorized to perform action: ${action}`);
    this.name = 'UnauthorizedCommentActionException';
  }
}
