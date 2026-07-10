import { Request, Response, NextFunction } from 'express';
import { z, ZodObject, ZodRawShape } from 'zod';

type RequestSchema = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
};

export function validate<
  TShape extends ZodRawShape,
  TOutput extends RequestSchema = z.output<ZodObject<TShape>>,
>(schema: ZodObject<TShape>) {
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

    const data = result.data as TOutput;

    if (data.body !== undefined) {
      req.body = data.body;
    }

    if (data.params !== undefined) {
      req.params = data.params as typeof req.params;
    }

    if (data.query !== undefined) {
      Object.assign(req.query, data.query);
    }

    next();
  };
}
