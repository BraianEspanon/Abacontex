import { Request, Response /*, NextFunction*/ } from 'express';
import { AppError } from '../errors/app-error';

export function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response /*,
  next: NextFunction
  */
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      code: error.code,
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Error interno del servidor',
  });
}
