import { AppError } from './app-error';
import { ErrorCode } from './error-codes';

export class UnauthorizedError extends AppError {
  constructor(message = 'Debes autenticarte para acceder a este recurso.', details?: unknown) {
    super(message, 401, ErrorCode.UNAUTHORIZED, details);
  }
}
