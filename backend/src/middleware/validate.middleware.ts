import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';

export function validate(schema: ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: result.error.flatten(),
      });
    }

    req.body = result.data.body;
    req.params = result.data.params as typeof req.params;
    if (result.data.query) {
      Object.assign(req.query, result.data.query);
    }

    next();
  };
}
