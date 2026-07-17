import { AppError } from './app-error';
import { ErrorCode } from './error-codes';

export class ConfigurationError extends AppError {
  constructor(message = 'La aplicación presenta un error de configuración.', details?: unknown) {
    super(message, 500, ErrorCode.CONFIGURATION_ERROR, details);
  }
}
