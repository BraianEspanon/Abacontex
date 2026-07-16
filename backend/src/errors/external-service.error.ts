import { AppError } from './app-error';
import { ErrorCode } from './error-codes';

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, details?: unknown) {
    super(message, 502, ErrorCode.EXTERNAL_SERVICE, {
      service,
      details,
    });
  }
}
