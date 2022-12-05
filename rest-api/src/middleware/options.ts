import { NextFunction, Request, Response } from "express";

export function options(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
}
