import { Request, Response, NextFunction } from 'express';
import { z, ZodObject, ZodRawShape } from 'zod';
import { BadRequestError } from '../errors/bad-request-error';
import { formatZodIssues } from '../utils/zod-error.utils';

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
      throw new BadRequestError('La solicitud contiene datos inválidos.', {
        errors: formatZodIssues(result.error.issues),
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
