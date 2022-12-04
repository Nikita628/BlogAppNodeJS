import { NextFunction, Request, Response } from "express";

export function executeSafely(
  func: (req: Request, res: Response, next?: NextFunction) => Promise<void>
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await func(req, res, next);
    } catch (error) {
      console.log("error: ", error);
      next(error);
    }
  };
}
