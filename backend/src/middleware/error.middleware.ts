import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/app-error';

export function errorMiddleware(error: unknown, req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    if (process.env.ENVIRONMENT !== 'production') {
      console.warn(`[${error.code}] ${error.message}`, error.details);
    }

    return res.status(error.statusCode).json({
      status: 'error',
      code: error.code,
      message: error.message,
      details: error.details,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }

  console.error(error);

  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Ha ocurrido un error interno del servidor.',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
}
