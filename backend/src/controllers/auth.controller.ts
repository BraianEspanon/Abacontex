import { Request, Response } from 'express';

export const me = (req: Request, res: Response) => {
  res.json({
    user: req.user,
  });
};
