import { AppError } from './app-error';
import { ErrorCode } from './error-codes';

export class NotFoundError extends AppError {
  constructor(message = 'El recurso solicitado no fue encontrado.', details?: unknown) {
    super(message, 404, ErrorCode.NOT_FOUND, details);
  }
}
