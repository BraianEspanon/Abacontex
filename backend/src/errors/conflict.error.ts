import { AppError } from './app-error';
import { ErrorCode } from './error-codes';

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 409, ErrorCode.CONFLICT, details);
  }
}
