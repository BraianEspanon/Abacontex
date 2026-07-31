import { NextFunction, Request, Response } from 'express';

import multer from 'multer';
import { BadRequestError } from '../errors/bad-request-error';

import { AppError } from '../errors/app-error';

export function errorMiddleware(error: unknown, req: Request, res: Response, _next: NextFunction) {
  if (error instanceof multer.MulterError) {
    let message = 'Error al procesar el archivo.';

    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'La imagen supera el tamaño máximo permitido.';
        break;

      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Archivo inesperado.';
        break;

      default:
        message = 'Error al procesar el archivo.';
    }

    error = new BadRequestError(message);
  }

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
