import { AppError } from './app-error';
import { ErrorCode } from './error-codes';

export class BadRequestError extends AppError {
  constructor(message = 'La solicitud contiene datos inválidos.', details?: unknown) {
    super(message, 400, ErrorCode.BAD_REQUEST, details);
  }
}
