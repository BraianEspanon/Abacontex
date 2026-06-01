import { Request, Response } from 'express';

export const health = (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
  });
};

export const root = (_req: Request, res: Response) => {
  res.send('Backend funcionando');
};