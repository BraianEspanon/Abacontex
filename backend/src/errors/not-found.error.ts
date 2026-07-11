import { AppError } from './app-error';

export class NotFoundError extends AppError {
  constructor(message: string, code = 'RESOURCE_NOT_FOUND') {
    super(message, 404, code);
  }
}
