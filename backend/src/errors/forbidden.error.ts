import { AppError } from './app-error';
import { ErrorCode } from './error-codes';

export class ForbiddenError extends AppError {
  constructor(message = 'No tienes permisos para realizar esta acción.', details?: unknown) {
    super(message, 403, ErrorCode.FORBIDDEN, details);
  }
}
